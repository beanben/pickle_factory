// import { ValidatorFn, AbstractControl, ValidationErrors, FormArray, FormControl, FormGroup } from '@angular/forms';

// // export function duplicateDescriptionValidator(): ValidatorFn {
// //   return (control: AbstractControl): ValidationErrors | null => {
// //     if (!(control instanceof FormArray)) {
// //       return null;
// //     }

// //     // console.log("control.value", control.value);
// //     const descriptions = control.value.map((unit: any) => unit.description);
// //     const hasDuplicates = descriptions.some((value: string, index: number) => descriptions.indexOf(value) !== index);

// //     return hasDuplicates ? { duplicateDescription: true } : null;
// //   };
// // }

// export function duplicateDescriptionValidator(): ValidatorFn {

//   return (control: AbstractControl): ValidationErrors | null => {
    
//     if(control instanceof FormArray){
//       const descriptions: string[] = control.value.map((unitGroup: any) => unitGroup.description.toLowerCase());
//       const hasDuplicates = descriptions.some((value: string, index: number) => descriptions.indexOf(value.toLowerCase()) !== index);
//       return hasDuplicates ? { duplicateDescription: true } : null;
//     }

//     else if (control instanceof FormControl && control.parent?.parent instanceof FormArray){
//       const formArray = control.parent?.parent;

//       if (!formArray) {
//         return null;
//       }

//       const descriptions: string[] = formArray!.value.map((unitGroup: any) => unitGroup.description.toLowerCase());

//       const description = control.value.toLowerCase();
//       const hasDuplicates = descriptions.includes(description);
//       // console.log("description", description)
//       return hasDuplicates ? { duplicateDescription: true } : null;
//     } 

//     else {
//       return null;
//     }
    
//   };
// }


// export function duplicateValidatorFormArray(controlName: string): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {

//     if(!(control instanceof FormArray)){
//       return null
//     }

//     // console.log("controlName", controlName);
//     let instances: string[] = control.value.map((unitGroup: any) => {
//       console.log("unitGroup.value", unitGroup.value)
//       // unitGroup.controlName.value.toLowerCase()
//     });
//     // instances = instances.map((str: string) => str.toLowerCase())
//     const hasDuplicates = instances.some((value: string, index: number) => instances.indexOf(value.toLowerCase()) !== index);
//     return hasDuplicates ? { duplicateValue: true } : null;

//   };
// }