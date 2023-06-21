import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Category, CategoryAndSubCategory } from 'src/app/data.models';
import { QuizService } from 'src/app/shared/services/quiz-service/quiz.service';

@Injectable({
  providedIn: 'root'
})
export class QuizMakerService {

  public groupSubCategoryList(categoryList: Category[]): CategoryAndSubCategory[] {
    const groupedCategoryList: CategoryAndSubCategory[] = [];

    categoryList.forEach((category, index) => {
      const [categoryName, subCategoryName] = category.name.split(': ');

      const existingCategory = groupedCategoryList.find(group => group.name === categoryName);
      if (existingCategory) {
        existingCategory.subCategoryList.push({...category, name: subCategoryName});
      } else {
        const groupedCategory: CategoryAndSubCategory = subCategoryName
        ? { id: index, name: categoryName, subCategoryList: [ {...category, name: subCategoryName} ]}
        : {...category, subCategoryList: []}
        groupedCategoryList.push(groupedCategory);
      }
    });

    return groupedCategoryList;
  }


}
