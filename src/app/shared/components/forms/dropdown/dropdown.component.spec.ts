import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent<Record<string, any>>;
  let fixture: ComponentFixture<DropdownComponent<Record<string, any>>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent]
    });
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
