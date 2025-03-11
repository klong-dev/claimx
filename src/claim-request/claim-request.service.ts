import { Injectable } from '@nestjs/common';
import { CreateClaimRequestDto } from './dto/create-claim-request.dto';
import { ClaimRequest } from './entities/claim-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ClaimRequestStatus } from 'src/enums/claimRequest.enum';
import { Claim } from 'src/claim/entities/claim.entity';
import { UpdateClaimRequestDto } from './dto/update-claim-request.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class ClaimRequestService {
  constructor(
    @InjectRepository(Claim)
    private claimRepo: Repository<Claim>,

    @InjectRepository(ClaimRequest)
    private claimRequestRepo: Repository<ClaimRequest>,

    @InjectRepository(User)
    private userRepo: Repository<User>) { }

  async create(userId: number, createClaimRequestDto: CreateClaimRequestDto) {
    const { claims, projectId, hours } = createClaimRequestDto;

    // Chuyển đổi claims từ DTO sang entity Claim[]


    // Tạo claimRequest entity
    const claimRequest = this.claimRequestRepo.create({
      claimer: { id: userId }, // Gán claimer bằng object { id: userId }
      project: { id: projectId }, // Gán projectId vào object Project
      hours,
      status: ClaimRequestStatus.PENDING,
    });

    await this.claimRequestRepo.save(claimRequest);

    const claimEntities = claims.map((claimDto) => this.claimRepo.create({
      ...claimDto,
      hours: Number(claimDto.hours),
      request: claimRequest
    }));

    // Lưu các claims trước khi lưu claimRequest
    await this.claimRepo.save(claimEntities);

    return claimRequest;

    // Lưu claimRequest vào database
  }

  async submitDraft(userId: number, claimRequestId: number) {
    const claimRequest = await this.claimRequestRepo.findOne({
      where: { id: claimRequestId },
      relations: ['claims']
    });
    if (!claimRequest) {
      throw new Error('Claim request not found');
    }
    if (claimRequest.status !== ClaimRequestStatus.DRAFT) {
      throw new Error('Claim request is not draft');
    }
    await this.claimRequestRepo.update(claimRequestId, {
      status: ClaimRequestStatus.PENDING,
      claimer: { id: userId }
    });
  }

  async save(userId: number, updateClaimRequestDto: UpdateClaimRequestDto) {
    const { requestId, claims, projectId, hours } = updateClaimRequestDto;

    const existingClaimRequest = await this.claimRequestRepo.findOne({
      where: { id: requestId },
      relations: ['claims'],
    });

    if (!existingClaimRequest || !requestId) {
      // Tạo claimRequest entity
      let claimRequest = this.claimRequestRepo.create({
        claimer: { id: userId }, // Gán claimer bằng object { id: userId }
        project: { id: projectId }, // Gán projectId vào object Project
        hours,
        status: ClaimRequestStatus.DRAFT,
      });
      await this.claimRequestRepo.save(claimRequest);

      const claimEntities = claims.map((claimDto) => this.claimRepo.create({
        ...claimDto,
        hours: Number(claimDto.hours),
        request: claimRequest
      }));

      await this.claimRepo.save(claimEntities);

      claimRequest = await this.claimRequestRepo.findOne({
        where: { id: claimRequest.id },
        relations: ['claims'],
      })
      return claimRequest; // data return
    }

    if ((existingClaimRequest.status !== ClaimRequestStatus.DRAFT) && (existingClaimRequest.status !== ClaimRequestStatus.RETURNED)) {
      throw new HttpException('ClaimRequest can not be saved', HttpStatus.BAD_REQUEST);
    }
    const updatedClaimRequest = this.claimRequestRepo.create({
      project: { id: projectId },
      hours,
      status: existingClaimRequest.status
    });
    await this.claimRequestRepo.update(requestId, updatedClaimRequest);

    await this.claimRepo.delete({ request: { id: requestId } });

    const claimEntities = claims.map((claimDto) => this.claimRepo.create({
      ...claimDto,
      hours: Number(claimDto.hours),
      request: existingClaimRequest
    }));

    await this.claimRepo.save(claimEntities);

    const updatedRequest = await this.claimRequestRepo.findOne({
      where: { id: requestId },
      relations: ['claims'],
    });
    return updatedRequest;
  }

  async findByClaimer(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    switch (user.role) {
      case 0:
        const claimRequests = await this.claimRequestRepo.find({
          where: { claimer: { id: userId } },
          relations: ['claims', 'claimer', 'project', 'approver', 'finance', 'project.userProjects', 'project.userProjects.user'],
          select: {
            id: true,
            hours: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            project: {
              name: true,
              userProjects: {
                role: true,
                user: {
                  id: true,
                  name: true,
                  email: true,
                  bankInfo: true,
                }
              }
            },
            claims: {
              id: true,
              date: true,
              from: true,
              to: true,
              hours: true,
              remark: true,
              status: true,
            },
            claimer: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            approver: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            finance: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
          }
        });
        claimRequests.forEach((request) => {
          if (request.project) {
            request.project.userProjects = request.project.userProjects.filter(
              (up) => up.user.id === userId
            );
          }
        });
        return claimRequests;
      case 1:
        return await this.claimRequestRepo.find({
          where: { status: In([ClaimRequestStatus.REJECTED, ClaimRequestStatus.CANCELLED, ClaimRequestStatus.APPROVED, ClaimRequestStatus.PENDING]) },
          relations: ['claims', 'claimer', 'project', 'approver'],
          select: {
            id: true,
            hours: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            claims: {
              id: true,
              date: true,
              from: true,
              to: true,
              hours: true,
              remark: true,
              status: true,
            },
            claimer: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            approver: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            }
          }
        });
      case 2:
        const claimRequest = await this.claimRequestRepo.find({
          where: { status: In([ClaimRequestStatus.PAID, ClaimRequestStatus.APPROVED]) },
          relations: ['claims', 'claimer', 'project', 'approver', 'finance', 'project.userProjects', 'project.userProjects.user'],
          select: {
            id: true,
            hours: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            claims: {
              id: true,
              date: true,
              from: true,
              to: true,
              hours: true,
              remark: true,
              status: true,
            },
            claimer: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            approver: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            finance: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            project: {
              name: true,
              userProjects: {
                role: true,
                user: {
                  id: true,
                  name: true,
                  email: true,
                  bankInfo: true,
                }
              }
            }
          }
        });
        claimRequest.forEach((request) => {
          request.project.userProjects = request.project.userProjects.filter(
            (up) => up.user.id === userId
          );
        });
        return claimRequest;
      case 3:
        return await this.claimRequestRepo.find({
          where: { status: Not(ClaimRequestStatus.DRAFT) },
          relations: ['claims', 'claimer', 'project', 'approver', 'finance'],
          select: {
            id: true,
            hours: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            claims: {
              id: true,
              date: true,
              from: true,
              to: true,
              hours: true,
              remark: true,
              status: true,
            },
            claimer: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            approver: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            },
            finance: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bankInfo: true,
            }
          }
        });
    }
  }

  async approve(userId: number, claimRequestId: number) {
    const claimRequest = await this.claimRequestRepo.findOne({
      where: { id: claimRequestId },
      relations: ['claims']
    });
    if (!claimRequest) {
      throw new HttpException('Claim request not found', HttpStatus.BAD_REQUEST);
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING) {
      throw new HttpException('Claim request is not pending', HttpStatus.BAD_REQUEST);
    }
    await this.claimRequestRepo.update(claimRequestId, {
      status: ClaimRequestStatus.APPROVED,
      approver: { id: userId }
    });
  }

  async reject(userId: number, claimRequestId: number) {
    const claimRequest = await this.claimRequestRepo.findOne({
      where: { id: claimRequestId },
      relations: ['claims']
    });
    if (!claimRequest) {
      throw new HttpException('Claim request not found', HttpStatus.BAD_REQUEST);
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING) {
      throw new HttpException('Claim request is not pending', HttpStatus.BAD_REQUEST);
    }
    await this.claimRequestRepo.update(claimRequestId, {
      status: ClaimRequestStatus.REJECTED,
      approver: { id: userId }
    });
  }

  async cancel(userId: number, claimRequestId: number) {
    const claimRequest = await this.claimRequestRepo.findOne({
      where: { id: claimRequestId },
      relations: ['claims']
    });
    if (!claimRequest) {
      throw new HttpException('Claim request not found', HttpStatus.BAD_REQUEST);
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING && claimRequest.status !== ClaimRequestStatus.CANCELLED && claimRequest.status !== ClaimRequestStatus.DRAFT) {
      throw new HttpException('Claim request cannot attach this action', HttpStatus.BAD_REQUEST);
    }
    await this.claimRequestRepo.update(claimRequestId, {
      status: ClaimRequestStatus.CANCELLED,
      claimer: { id: userId }
    });
  }

  async return(userId: number, claimRequestId: number) {
    const claimRequest = await this.claimRequestRepo.findOne({
      where: { id: claimRequestId },
      relations: ['claims']
    });
    if (!claimRequest) {
      throw new HttpException('Claim request not found', HttpStatus.BAD_REQUEST);
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING) {
      throw new HttpException('Claim request is not approved', HttpStatus.BAD_REQUEST);
    }
    await this.claimRequestRepo.update(claimRequestId, {
      status: ClaimRequestStatus.RETURNED,
      finance: { id: userId }
    });
  }

  async pay(userId: number, claimRequestId: number) {
    const claimRequest = await this.claimRequestRepo.findOne({
      where: { id: claimRequestId },
      relations: ['claims']
    });
    if (!claimRequest) {
      throw new HttpException('Claim request not found', HttpStatus.BAD_REQUEST);
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING) {
      throw new HttpException('Claim request is not approved', HttpStatus.BAD_REQUEST);
    }
    await this.claimRequestRepo.update(claimRequestId, {
      status: ClaimRequestStatus.PAID,
      finance: { id: userId }
    });
  }
}
