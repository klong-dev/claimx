import { Injectable } from '@nestjs/common';
import { CreateClaimRequestDto } from './dto/create-claim-request.dto';
import { ClaimRequest } from './entities/claim-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ClaimRequestStatus } from 'src/enums/claimRequest.enum';
import { Claim } from 'src/claim/entities/claim.entity';
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
    const claimEntities = claims.map((claimDto) => this.claimRepo.create({
      ...claimDto,
      hours: Number(claimDto.hours),
    }));

    // Tạo claimRequest entity
    const claimRequest = this.claimRequestRepo.create({
      claimer: { id: userId }, // Gán claimer bằng object { id: userId }
      project: { id: projectId }, // Gán projectId vào object Project
      hours,
      claims: claimEntities, // Gán danh sách Claim entities
      status: ClaimRequestStatus.PENDING,
    });

    // Lưu các claims trước khi lưu claimRequest
    await this.claimRepo.save(claimEntities);

    // Lưu claimRequest vào database
    return await this.claimRequestRepo.save(claimRequest);
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

  async findByClaimer(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
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
      throw new Error('Claim request not found');
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING) {
      throw new Error('Claim request is not pending');
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
      throw new Error('Claim request not found');
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING) {
      throw new Error('Claim request is not pending');
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
      throw new Error('Claim request not found');
    }
    if (claimRequest.status !== ClaimRequestStatus.PENDING) {
      throw new Error('Claim request is not pending');
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
      throw new Error('Claim request not found');
    }
    if (claimRequest.status !== ClaimRequestStatus.APPROVED) {
      throw new Error('Claim request is not approved');
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
      throw new Error('Claim request not found');
    }
    if (claimRequest.status !== ClaimRequestStatus.APPROVED) {
      throw new Error('Claim request is not approved');
    }
    await this.claimRequestRepo.update(claimRequestId, {
      status: ClaimRequestStatus.PAID,
      finance: { id: userId }
    });
  }
}
