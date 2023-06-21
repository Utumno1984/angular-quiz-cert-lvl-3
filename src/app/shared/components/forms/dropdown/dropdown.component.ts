import { Component, computed, forwardRef, Input, OnChanges, OnInit, signal, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { BoldMatchPipe } from 'src/app/shared/pipes/bold-match.pipe';

type Nullable<T> = T | null | undefined;

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BoldMatchPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent<T extends Record<string, any>>
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() placeholder = 'Select option';
  @Input() options: {[key: string]: any}[] = [];
  @Input() labelKey = 'name';
  value!: Nullable<T>;
  @Input() filter = signal('');
  optionList: {[key: string]: any}[] = [];

  ngOnInit(){
    this.filteredOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.optionList = changes['options'].currentValue.map((option: {[key: string]: any}) => {
      return {...option, visible: true};
    })
  }

  filteredOptions = computed(() =>{
    // Now filteredOptions is tracked by filter().
    const _value = this.filter() ?? '';
    this.optionList = this.optionList.map((option) => {
      option['visible'] = !_value || ((option?.[this.labelKey] || '') as string).toLowerCase().includes((_value).toLowerCase());
      return option;
    });
    return this.optionList;
  });

  onChange = (value: any) => {};
  onTouch = (value: Nullable<T>) => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: any): void {
    this.value = value;
    this.filter.set(value?.[this.labelKey]);
    this.onChange(value);
    this.onTouch(value);
  }
}
