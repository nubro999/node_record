import { Test, TestingModule } from '@nestjs/testing';
import { DiariesService } from './diaries.service';
import { OpenAiService } from '../openai/openai.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';

describe('DiariesService', () => {
  let service: DiariesService;
  let openAiService: OpenAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiariesService,
        {
          provide: getRepositoryToken(Diary),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: OpenAiService,
          useValue: {
            analyzeDiary: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                save: jest.fn(),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<DiariesService>(DiariesService);
    openAiService = module.get<OpenAiService>(OpenAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAiAnalysis', () => {
    it('should return AI analysis of diary', async () => {
      const diaryId = 1;
      const userId = 1;
      const mockDiary = {
        id: diaryId,
        content: '오늘은 좋은 날이었다.',
        title: '좋은 하루',
        date: new Date('2023-01-01'), // Date 객체로 변경
      };
      
      const mockAnalysis = {
        analysis: '긍정적인 감정이 담긴 일기입니다.',
        sentiment: '긍정적',
      };
      
      // findOne 메서드 모킹
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDiary as any);
      
      // OpenAI 서비스 모킹
      jest.spyOn(openAiService, 'analyzeDiary').mockResolvedValue(mockAnalysis);
      
      const result = await service.getAiAnalysis(diaryId, userId);
      
      expect(result).toEqual(mockAnalysis);
      // 날짜 형식이 'YYYY-MM-DD'로 전달되는지 확인
      expect(openAiService.analyzeDiary).toHaveBeenCalledWith(
        mockDiary.content, 
        '2023-01-01' // 이 부분은 실제 구현에 따라 달라질 수 있음
      );
    });
  });
});
