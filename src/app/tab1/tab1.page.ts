import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterModel } from '../interfaces/filterModel';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  searchData = [
    {
      id: 1,
      name: "John",
      subMenu: [
        {
          id: 11,
          name: "Sub John",
        },
        {
          id: 12,
          name: "Hello John",
        },
      ],
    },
    {
      id: 2,
      name: "Jane",
      subMenu: [
        {
          id: 22,
          name: "Sub Jane",
        },
      ],
    },
    {
      id: 3,
      name: "Smith",
      subMenu: [
        {
          id: 33,
          name: "Sub Smith",
        },
      ],
    },
    {
      id: 4,
      name: "james",
      subMenu: [
        {
          id: 44,
          name: "Sub james",
        },
      ],
    },
    {
      id: 5,
      name: "Jimmy",
      subMenu: [
        {
          id: 55,
          name: "Sub Jimmy",
        },
      ],
    },
  ];
  param2List = [];
  searchFilterForm: FormGroup;
  searchParam: '';
  preSelectList = [];
  message: string = '';
  updated: boolean = false;
  submitted: boolean;
  submittedForm: boolean;
  presetSelected:string = '';
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initPriceForm()
    this.updatePreselectList()
  }
  get f() { return this.searchFilterForm.controls; }
  addRow(flag?: boolean) {
    if (flag) {
      if (this.allSearch().controls.length > 0) return;
      this.addSearch({ param1: '', param2: '', param3: '' })
      return
    }
    this.addSearch({ param1: '', param2: '', param3: '' })
  }

  removeRow(index: number) {
    if (confirm('Do you want remove row?')) {
      this.allSearch().removeAt(index)
      this.UpdateSearchByRemoving(index)

    }
  }

  deletePreset() {
    let messageSpan = document.getElementById("message");
    const localData: any = localStorage.getItem("presetSearch");
    const localJSON = JSON.parse(localData);
    if (localJSON[this.searchParam]) {
      const temp1 = localJSON[this.searchParam];

      if (confirm(`Are you sure to delete ${this.searchParam} preset.`)) {
        delete localJSON[this.searchParam];
        localStorage.setItem("presetSearch", JSON.stringify(localJSON));
        messageSpan.style.color = 'green'
        this.message = `'${this.searchParam}' is deleted successfully.`;
        if (this.message) {
          setTimeout(() => {
            this.message = '';
          }, 3000)
        }
        this.updatePreselectList();
        this.allSearch().clear();
      }
    }
    else {
      messageSpan.style.color = 'red';
      this.message = `${this.searchParam} is not present in preset list.`;
      if (this.message) {
        setTimeout(() => {
          this.message = '';
        }, 5000)
      }

    }
  }

  UpdateSearchByRemoving(index: any) {
    const localData: any = localStorage.getItem("presetSearch");
    const localJSON = JSON.parse(localData);

    if (localJSON[this.searchParam]) {
      const temp1 = localJSON[this.searchParam]
      temp1.splice(index, 1)
      if (temp1.length > 0) {
        localStorage.setItem("presetSearch", JSON.stringify(localJSON));
      } else {
        delete localJSON[this.searchParam];
        localStorage.setItem("presetSearch", JSON.stringify(localJSON));
      }
      this.updatePreselectList();
      for (let i = 0; i < this.allSearch().length; i++) {
        this.onParam1Change(i);
      }
    }
  }

  clearFilter() {

    const localData: any = localStorage.getItem("presetSearch");
    const localJSON = JSON.parse(localData);

    if (localJSON[this.searchParam]) {

      if (JSON.stringify(localJSON[this.searchParam]) !== JSON.stringify(this.allSearch().value)) {
        if (confirm("Do you want to clear your unsaved changes to filter: " + this.searchParam)) {
          this.allSearch().clear();
          this.searchParam = ''
        }
      } else {
        this.allSearch().clear();
        this.searchParam = ''
      }
    } else {
      if (confirm("Do you want to clear your unsaved changes to filter")) {
        this.allSearch().clear();
        this.searchParam = ''
      }
    }
    this.presetSelected = ''

  }


  initPriceForm() {
    this.searchFilterForm = this.fb.group({
      search: this.fb.array([]),
    });
  }

  newEvent(item?): FormGroup {
    return this.fb.group({
      param1: [item?.param1, [Validators.required,]],
      param2: [{ value: item?.param2, disabled: item?.param2 ? false : true }, [Validators.required]],
      param3: [{ value: item?.param3, disabled: item?.param3 ? false : true }, [Validators.required]],

    });
  }

  allSearch(): FormArray {
    return this.searchFilterForm.get('search') as FormArray;
  }

  getArray() {
    return this.searchFilterForm.get('search') as any;
  }

  addSearch(item: any) {
    this.allSearch().push(this.newEvent(item));
  }

  clearFormArray() {
    (this.searchFilterForm.controls['search'] as FormArray)?.clear();
  }

  onParam1Change(i: any) {
    const row = this.allSearch().controls[i] as FormGroup
    const menu = this.searchData.find(f => f.name.toLowerCase() === row.get('param1').value.toLowerCase())
    row.get('param2').enable()
    row.get('param3').enable()
    if (this.param2List && this.param2List.length > 0) {
      this.param2List[i] = menu.subMenu
    } else {
      this.param2List.push(menu.subMenu)
    }
    row.get('param2').markAllAsTouched()
    row.get('param2').markAsDirty()
    row.get('param2').setValue(this.param2List[i][0].name)
  }

  getClass(form: any, key: any) {
    return this
  }

  savePreselectForm() {
    this.submitted = true;

    if (!this.allSearch().valid) {
      return;
    }

    let filterData: FilterModel[] = this.searchFilterForm.value.search as FilterModel[];
    let every = filterData.every((m) => m.param1 !== '' && m.param2 !== '' && m.param3 !== '');
    let messageSpan = document.getElementById("message");
    let isModified = true;
    if (every) {
      var localJSON = {};
      const localData = localStorage.getItem("presetSearch");
      if (localData && localData != "null") {
        localJSON = JSON.parse(localData);
      }

      if (localJSON[this.searchParam]) {
        const temp1 = localJSON[this.searchParam]
        const temp2 = this.searchFilterForm.value.search;
        if (JSON.stringify(temp1) == JSON.stringify(temp2)) {
          messageSpan.style.color = 'green';
          this.message = 'Your Filter stored successfully';
          if (this.message) {
            setTimeout(() => {
              this.message = '';
            }, 3000)
          }
          return
        } else {
          isModified = confirm("Your are updating the current filter: " + this.searchParam + " Please confirm");
        }
      }

      if (this.preSelectList.includes(this.searchParam)) {
        if (isModified) {
          filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
          const finalData = { [this.searchParam]: this.searchFilterForm.value.search };

          localStorage.setItem("presetSearch", JSON.stringify({ ...localJSON, ...finalData }));
          this.updatePreselectList()
          messageSpan.style.color = 'green'
          this.message = "Your filter updated successfully.";
        }
      }
      else {
        filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
        const finalData = { [this.searchParam]: this.searchFilterForm.value.search };

        localStorage.setItem("presetSearch", JSON.stringify({ ...localJSON, ...finalData }));
        this.updatePreselectList()
        this.message = this.updated ? 'Filter updated successfully.' : 'Your Filter stored successfully.';
        this.searchParam = '';
        if (this.message) {
          setTimeout(() => {
            this.message = '';
          }, 3000)
        }
      }
    }
    else {
      messageSpan.style.color = 'red';
      this.message = 'All fields are mandatory.';
    }
  }

  updatePreselectList() {
    var localJSON = {};
    const localData = localStorage.getItem("presetSearch");
    if (localData && localData != "null") {
      localJSON = JSON.parse(localData);
      const temp = [] as string[];
      Object.keys(localJSON).map((key) => {
        temp.push(key);
      });
      this.preSelectList = temp
    }
  }

  onPreselectDDLChange(e: any) {
    this.searchParam = e.target.value
    const changes = this.trackChanges(this.searchParam);
    if (!changes) {
      if (!confirm("Do you want to discard the current filter changes")) {
        return
      }
    }
    // const localData = localStorage.getItem("presetSearch");
    // var localJSON = JSON.parse(localData);
    // let data = localJSON[this.searchParam];
    // debugger

    // if (!changes && this.allSearch().controls.length > 0 && this.allSearch().controls.length !== data.length) {
    //   if (!confirm("Do you want to discard the current filter changes")) {
    //     return;
    //   }
    // }

    // if ()


    if (this.searchParam && this.searchParam !== 'Select') {
      this.clearFormArray()
      const localData = localStorage.getItem("presetSearch");
      if (localData && localData != "null") {
        var localJSON = JSON.parse(localData);
        const tempArray = [] as any[];
        Object.keys(localJSON[e.target.value]).map((key: any, index: any) => {
          const menu = this.searchData.find((f) => f.name.toLowerCase() === localJSON[e.target.value][index].param1.toLowerCase());
          if (this.param2List && this.param2List.length > 0) {
            this.param2List[index] = menu.subMenu
          } else {
            this.param2List.push(menu.subMenu)
          }
          tempArray.push({
            param1: localJSON[e.target.value][key].param1,
            param2: localJSON[e.target.value][key].param2,
            param3: localJSON[e.target.value][key].param3,
          });
        });
        tempArray.map(m => {
          this.addSearch(m)
        })
      }
      else {
        this.allSearch().clear();
      }
    }
  }

  trackChanges = (param: any) => {
    const localData = localStorage.getItem("presetSearch");
    var localJSON = JSON.parse(localData);
    let data = localJSON[param];

    if (!data) {
      return false
    }

    if (data.length === this.allSearch().controls.length) {
      if (JSON.stringify(data) !== JSON.stringify(this.allSearch().value)) {
        return false
      }
    }
    return true;
  }


  drop(event: CdkDragDrop<any>) {
    const previous = this.allSearch().at(event.previousIndex);
    const current = this.allSearch().at(event.currentIndex);
    this.allSearch().setControl(event.currentIndex, previous);
    this.allSearch().setControl(event.previousIndex, current);
    this.onParam1Change(event.currentIndex)
    this.onParam1Change(event.previousIndex)
  }
}
