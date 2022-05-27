import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

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
  searchParam: ''
  preSelectList = [];
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initPriceForm()
    this.addRow()
    this.updatePreselectList()
  }

  addRow() {
    this.addSearch({ param1: '', param2: '', param3: 'test' })
  }

  removeRow(index: number) {
    this.allSearch().removeAt(index)
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
    this.searchFilterForm.value;
    var localJSON = {};
    const localData = localStorage.getItem("presetSearch");
    if (localData && localData != "null") {
      localJSON = JSON.parse(localData);
    }
    const finalData = { [this.searchParam]: this.searchFilterForm.value.search };
    localStorage.setItem("presetSearch", JSON.stringify({ ...localJSON, ...finalData }));
    this.updatePreselectList()

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
    this.clearFormArray()
    const localData = localStorage.getItem("presetSearch");
    if (localData && localData != "null") {
      var localJSON = JSON.parse(localData);
      const tempArray = [] as any[];
      debugger
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
      debugger;
      // setAddRow(tempArray);
      tempArray.map(m => {
        this.addSearch(m)
      })
    }
  }


}
