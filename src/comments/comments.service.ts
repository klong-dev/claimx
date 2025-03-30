import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { content, claimRequestId, repCommentId } = createCommentDto;
    if (!content || !claimRequestId)
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);

    let user: User;
    if (repCommentId) {
      user = (await this.commentRepository.findOne({
        where: { id: repCommentId },
        relations: ['author'],
      })).author;
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const comment = this.commentRepository.create({
      content,
      claimRequest: { id: claimRequestId },
      author: { id: userId },
      repComment: { id: repCommentId },
      replier: user
    })
    await this.commentRepository.save(comment);

    return await this.commentRepository.findOne({
      where: { id: comment.id },
      relations: ['author', 'replier', 'repComment'],
      select: {
        id: true,
        content: true,
        repComment: {
          id: true,
          content: true,
        },
        author: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
        replier: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(userId: number, requestId: number) {
    const comments = this.commentRepository.find({
      where: { claimRequest: { id: requestId } },
      relations: ['author', 'replier'],
      select: {
        id: true,
        content: true,
        author: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
        replier: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
        createdAt: true,
        updatedAt: true,
      }
    });
    return comments;
  }



  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
