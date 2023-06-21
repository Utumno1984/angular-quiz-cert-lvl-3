import { TestBed } from '@angular/core/testing';

import { QuizMakerService } from './quiz-maker.service';

describe('QuizMakerService', () => {
  let service: QuizMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
