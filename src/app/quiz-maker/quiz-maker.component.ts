import {Component, OnInit, signal} from '@angular/core';
import {Category, CategoryAndSubCategory, Difficulty, Question} from '../data.models';
import {Observable, Subscription, map, takeWhile, tap} from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

import { Difficulty as Diff } from '../shared/models/enums/difficulty.enum';
import { Nullable } from '../shared/models/types/nullable.type';
import { QuizMakerService } from '../shared/services/quiz-maker-service/quiz-maker.service';
import { QuizService } from '../shared/services/quiz-service/quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
  providers:[
    QuizMakerService
  ]
})
export class QuizMakerComponent implements OnInit {

  form: FormGroup = new FormGroup({
    category: new FormControl(null),
    subCategory: new FormControl(null),
    difficult: new FormControl(null)
  });

  categories$: Observable<CategoryAndSubCategory[]>;
  questions$!: Observable<Question[]>;
  questions: Question[] | null = null;
  questionsAmount: number =  5;
  difficultyList: {name: Difficulty}[] = Object.values(Diff).map((difficult: Difficulty) => {return {name: difficult}});
  bonusQuestion = signal<Nullable<Question>>(null);
  sink: Subscription[] = [];
  subCategoryList = signal([]);

  constructor(private quizService: QuizService, private quizMakerService: QuizMakerService) {
    this.categories$ = this.quizService.getAllCategories().pipe(
      map((categoryList) => {
        // the method called by the service takes care of separating, from each element of the list,
        // the categories from the sub-categories separated by a colon, if any.
        return this.quizMakerService.groupSubCategoryList(categoryList);
      })
    );
  }

  ngOnInit(): void {
    // subscription to detect the changes in value of the category field;
    const subscription = this.form.controls['category'].valueChanges
    .subscribe(() => {
      // each time an option from the category list is chosen,
      // the relative list of subcategories is assigned to the subCategoryList property.
      const newSubCategoryList = this.form.controls['category'].value.subCategoryList;
      this.subCategoryList.set(newSubCategoryList);
      // each time the category changes, the value of the subcategory field is cleared
      this.form.controls['subCategory'].setValue(null);
    })
    this.sink.push(subscription);
  }

  createQuiz(): void {
    // during the creation of the quiz, we fetch an extra question that will be used as a replacement;
    // in this way we save extra api roundtrip and we also make sure that the extra question
    // doesn't have any duplicate in the set, therefore improving performances.
    this.questions$ = this.quizService.createQuiz(
      this.form.controls['subCategory']?.value?.id ?? this.form.controls['category'].value?.id,
      this.form.controls['difficult'].value as Difficulty,
      // takes an extra question from the api
      this.questionsAmount + 1
    ).pipe(
      map((data) => {
        this.bonusQuestion.set(null);
        const qstList = [...data];
        // this control allows us to hide the extra question button if the api doesn't have enough questions
        // to select from (questionAmount exceedes the number of available questions in the api).
        if(this.questionsAmount + 1 === qstList.length){
          //the extra question is removed from the expanded question list and is kept in the questionsAmount property, ready to be used when needed.
          this.bonusQuestion.set(qstList.pop());
        }
        this.questions = qstList;
        return this.questions;
      })
    )
  }

  onQuestionChanged(question: Question){
    // retrieves the index from the selected question in order to find it in the list and replace it with the bonus one;
    const qtcIndex = this.questions!.indexOf(question);
    this.questions![qtcIndex] = this.bonusQuestion()!;
    this.bonusQuestion.set(null);
  }

  ngOnDestroy(){
    // delete all subscriptions.
    this.sink.forEach((s: Subscription) => {
      s.unsubscribe();
    });
  }
}
