import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initPriceForm()
    this.updatePreselectList()
  }

  addRow(flag?: boolean) {
    if (flag) {
      if (this.allSearch().controls.length > 0) return;
      this.addSearch({ param1: '', param2: '', param3: '' })
      return
    }
    this.addSearch({ param1: '', param2: '', param3: '' })
  }

  removeRow(index: number) {
    this.allSearch().removeAt(index)
  }

  clearFilter() {
    this.allSearch().clear();
  }


  initPriceForm() {
    this.searchFilterForm = this.fb.group({
      search: this.fb.array([]),
    });
  }

  newEvent(item?): FormGroup {
    return this.fb.group({
      param1: [item?.param1],
      param2: [item?.param2],
      param3: [item?.param3],
    });
  }

  allSearch(): FormArray {
    return this.searchFilterForm.get('search') as FormArray;
  }

  getArray() {
    return this.searchFilterForm.get('search') as any;
  }

  addSearch(item) {
    this.allSearch().push(this.newEvent(item));

  }

  clearFormArray() {
    (this.searchFilterForm.controls['search'] as FormArray)?.clear();
  }

  onParam1Change(i) {
    const row = this.allSearch().controls[i] as FormGroup
    const menu = this.searchData.find(f => f.name.toLowerCase() === row.get('param1').value.toLowerCase())
    if (this.param2List && this.param2List.length > 0) {
      this.param2List[i] = menu.subMenu
    } else {
      this.param2List.push(menu.subMenu)
    }
  }
  
  savePreselectForm() {
    let filterData: FilterModel[] = this.searchFilterForm.value.search as FilterModel[];
    console.log(this.checkIfPresetModified(filterData, this.searchParam));
    let every = filterData.every((m) => m.param1 !== '' && m.param2 !== '' && m.param3 !== '');
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
          alert('Your data is not modified.');
          return

        } else {
           isModified = confirm("You updating the current filter: " + this.searchParam + " Please confirm")
        }

      }

      if (this.preSelectList.includes(this.searchParam)) {
        if(isModified) {
          if (confirm("Name already exists. Are you sure?")) {
            filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
            const finalData = { [this.searchParam]: this.searchFilterForm.value.search };
  
            localStorage.setItem("presetSearch", JSON.stringify({ ...localJSON, ...finalData }));
            this.updatePreselectList()
          }
        }
      }
      else {
        filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
        const finalData = { [this.searchParam]: this.searchFilterForm.value.search };

        localStorage.setItem("presetSearch", JSON.stringify({ ...localJSON, ...finalData }));
        this.updatePreselectList()
        alert('Your Filter stored successfully.');
      }
    }
    else {
      alert('All field are mandatory.');
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
      // setAddRow(tempArray);
      tempArray.map(m => {
        this.addSearch(m)
      })
    }
  }


  drop(event: CdkDragDrop<any>) {
    const previous = this.allSearch().at(event.previousIndex);
    const current = this.allSearch().at(event.currentIndex);
    this.allSearch().setControl(event.currentIndex, previous);
    this.allSearch().setControl(event.previousIndex, current);
    this.onParam1Change(event.currentIndex)
    this.onParam1Change(event.previousIndex)
  }

  checkIfPresetModified(filters: FilterModel[], name: string) {
    // let flag:boolean = false;
    // const localData:any = JSON.stringify(localStorage.getItem('presetSearch'));
    // if(localData){
    //   for (const key in localData) {  
    //     if(name == key && filters &&  filters?.length == localData[key]?.length){
    //      filters.forEach((f,i)=>{
    //        if(f.param1 != localData[key][i].param1 && f.param2 != localData[key][i].param2 && f.param3 != localData[key][i].param3){
    //          return true;
    //        }else{
    //          flag = false;
    //        }
    //      })
    //     }else{
    //       return true;
    //     }
    //   }
    // }

  }

}
