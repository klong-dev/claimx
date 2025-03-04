import { Injectable } from '@nestjs/common';
import { CreateClaimRequestDto } from './dto/create-claim-request.dto';
import { ClaimRequest } from './entities/claim-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
@Injectable()
export class ClaimRequestService {
  constructor(
    @InjectRepository(ClaimRequest)
    private claimRequestRepo: Repository<ClaimRequest>,

    @InjectRepository(User)
    private userRepo: Repository<User>) { }

  async create(userId: number, createClaimRequestDto: CreateClaimRequestDto) {
    await this.claimRequestRepo.save({
      ...createClaimRequestDto,
      claimer: { id: userId },
      status: 1, // active
    });
  }

  async findByClaimer(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    switch (user.role) {
      case 0:
        return await this.claimRequestRepo.find({
          where: { claimer: { id: userId } },
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
            },
          }
        });
      case 1:
        return await this.claimRequestRepo.find({
          where: { status: In([1, 2]) },
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
        return await this.claimRequestRepo.find({
          where: { status: In([2, 3]) },
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
      case 3:
        return await this.claimRequestRepo.find({
          where: { status: Not(0) },
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
}
