import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../shared/services/quiz-service/quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] | null = [];
  @Input() canChangeQuestion?: boolean;
  @Output() questionChanged = new EventEmitter<Question>();

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);
  answersLength: number = 0;

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  setAnswers(answer: string, index: number){
    this.userAnswers[index] = answer;
    this.answersLength = this.userAnswers.filter((nsw) => nsw).length;
  }

  questionChangeButtonClick(question: Question) {
    this.questionChanged.emit(question);
    --this.answersLength;
  }

}
