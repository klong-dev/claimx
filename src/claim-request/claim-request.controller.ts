import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClaimRequestService } from './claim-request.service';
import { CreateClaimRequestDto } from './dto/create-claim-request.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateClaimRequestDto } from './dto/update-claim-request.dto';

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

  @Post('/save')
  @UseGuards(JwtAuthGuard)
  async save(@Req() req, @Body() dto: UpdateClaimRequestDto) {
    const userId = req.user.id;
    return this.claimRequestService.save(userId, dto);
  }

  @Put('approve/:requestId')
  @UseGuards(JwtAuthGuard)
  async approve(@Req() req, @Param('requestId') requestId: number) {
    const userId = req.user.id;
    return this.claimRequestService.approve(userId, requestId);
  }

  @Put('reject/:requestId')
  @UseGuards(JwtAuthGuard)
  async reject(@Req() req, @Param('requestId') requestId: number) {
    const userId = req.user.id;
    return this.claimRequestService.reject(userId, requestId);
  }

  @Put('return/:requestId')
  @UseGuards(JwtAuthGuard)
  async return(@Req() req, @Param('requestId') requestId: number) {
    const userId = req.user.id;
    return this.claimRequestService.return(userId, requestId);
  }

  @Put('submit/:requestId')
  @UseGuards(JwtAuthGuard)
  async submit(@Req() req, @Param('requestId') requestId: number) {
    const userId = req.user.id;
    return this.claimRequestService.submitDraft(userId, requestId);
  }

  @Put('cancel/:requestId')
  @UseGuards(JwtAuthGuard)
  async cancel(@Req() req, @Param('requestId') requestId: number) {
    const userId = req.user.id;
    return this.claimRequestService.cancel(userId, requestId);
  }

  @Put('pay/:requestId')
  @UseGuards(JwtAuthGuard)
  async pay(@Req() req, @Param('requestId') requestId: number) {
    const userId = req.user.id;
    return this.claimRequestService.pay(userId, requestId);
  }
}
