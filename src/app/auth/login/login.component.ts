import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}
//Check email tồn tại hay ko. có thể check các thứ khác
function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'akita141188@gmail.com') {
    return of(null);
  }
  return of({ notUnique: true });
}

let initialValue = '';
const saveForm = window.localStorage.getItem('saved-login-form');
if (saveForm) {
  const loadForm = JSON.parse(saveForm);
  initialValue = loadForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    // const saveForm = window.localStorage.getItem('save-login-form');
    // if (saveForm) {
    //   const loadedForm = JSON.parse(saveForm);
    //   this.form.patchValue({
    //     email: loadedForm.email,
    //   });
    // }
    const subcription = this.form.valueChanges.subscribe({
      next: (value) => {
        window.localStorage.setItem(
          'saved-login-form',
          JSON.stringify({ email: value.email })
        );
      },
    });
    this.destroyRef.onDestroy(() => subcription.unsubscribe());
  }
  form = new FormGroup({
    email: new FormControl(initialValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  get emailInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get passwordInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  onSubmit() {
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {
//   private form = viewChild.required<NgForm>('form');
//   private destroyRef = inject(DestroyRef);

//   constructor() {
//     const saveForm = window.localStorage.getItem('save-form-login');
//     if (saveForm) {
//       const loadedFormData = JSON.parse(saveForm);
//       const savedEmail = loadedFormData.email;

//       setTimeout(() => {
//         this.form().controls['email'].setValue(savedEmail);
//       }, 1);
//     }

//     afterNextRender(() => {
//       const subcription = this.form()
//         .valueChanges?.pipe(debounceTime(500))
//         .subscribe({
//           next: (value) =>
//             window.localStorage.setItem(
//               'save-form-login',
//               JSON.stringify({ email: value.email })
//             ),
//         });
//       this.destroyRef.onDestroy(() => subcription?.unsubscribe());
//     });
//   }
//   onSubmit(formData: NgForm) {
//     const enteredEmail = formData.form.value.email;
//     const enteredPassword = formData.form.value.password;
//     formData.form.reset();
//   }
// }
