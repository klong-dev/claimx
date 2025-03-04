import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClaimRequestService } from './claim-request.service';
import { CreateClaimRequestDto } from './dto/create-claim-request.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('claim-request')
export class ClaimRequestController {
  constructor(private readonly claimRequestService: ClaimRequestService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() dto: CreateClaimRequestDto) {
    const userId = req.user.id;
    return this.claimRequestService.create(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByClaimer(@Req() req) {
    const userId = req.user.id;
    return this.claimRequestService.findByClaimer(userId);
  }
}
