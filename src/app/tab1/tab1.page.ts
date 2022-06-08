import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterModel } from '../interfaces/filterModel';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
declare var easepick: any

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  searchData = [
    {
      id: 1,
      name: "CLIP_NOTES",
      type: 'text',
      subMenu: [
        {
          id: 1,
          name: "CONTAINS",
        },
        {
          id: 2,
          name: "CONTAINS_WORDS",
        },
        {
          id: 3,
          name: "IS",
        },
        {
          id: 4,
          name: "BEGINS_WITH",
        },
        {
          id: 5,
          name: "ENDS_WITH",
        },
        {
          id: 6,
          name: "IS_NOT",
        },
      ],
    },
    {
      id: 2,
      name: "FRAME_NOTES",
      type: 'text',
      subMenu: [
        {
          id: 1,
          name: "CONTAINS",
        },
        {
          id: 2,
          name: "CONTAINS_WORDS",
        },
        {
          id: 3,
          name: "IS",
        },
        {
          id: 4,
          name: "BEGINS_WITH",
        },
        {
          id: 5,
          name: "ENDS_WITH",
        },
        {
          id: 6,
          name: "IS_NOT",
        },
      ],
    },
    {
      id: 3,
      name: "TRANSCRIPTS",
      type: 'text',
      subMenu: [
        {
          id: 1,
          name: "CONTAINS",
        },
        {
          id: 2,
          name: "CONTAINS_WORDS",
        },
        {
          id: 3,
          name: "IS",
        },
        {
          id: 4,
          name: "BEGINS_WITH",
        },
        {
          id: 5,
          name: "ENDS_WITH",
        },
        {
          id: 6,
          name: "IS_NOT",
        },
      ],
    },
    {
      id: 4,
      name: "FILE_NAME",
      type: 'text',
      subMenu: [
        {
          id: 1,
          name: "CONTAINS",
        },
        {
          id: 2,
          name: "IS",
        },
        {
          id: 3,
          name: "BEGINS_WITH",
        },
        {
          id: 4,
          name: "ENDS_WITH",
        },
        {
          id: 5,
          name: "IS_NOT",
        },
      ],
    },
    {
      id: 5,
      name: "DURATION",
      type: 'text',
      subMenu: [
        {
          id: 1,
          name: "LONGER_THAN",
        },
        {
          id: 2,
          name: "SHORTER_THAN",
        },
        {
          id: 3,
          name: "SHOW_TOTAL_DURATION_FOR_SELECTION",
        },
      ],
    },
    {
      id: 5,
      name: "CARD_SERIAL",
      type: 'text',
      subMenu: [
        {
          id: 1,
          name: "CONTAINS",
        },
        {
          id: 2,
          name: "IS",
        },
        {
          id: 3,
          name: "IS_NOT",
        },
      ],
    },
    {
      id: 5,
      name: "RECORDER_SERIAL",
      type: 'text',
      subMenu: [
        {
          id: 1,
          name: "CONTAINS",
        },
        {
          id: 2,
          name: "IS",
        },
        {
          id: 3,
          name: "IS_NOT",
        },
      ],
    },
    {
      id: 6,
      name: "SHOOTING_DATE",
      type: 'date',
      subMenu: [
        {
          id: 1,
          name: "EXACTLY",
        },
        {
          id: 2,
          name: "BEFORE",
        },
        {
          id: 3,
          name: "AFTER",
        },
        {
          id: 4,
          name: "BETWEEN",
        },
      ],
    },
    {
      id: 6,
      name: "CREATION_DATE",
      type: 'date',
      subMenu: [
        {
          id: 1,
          name: "EXACTLY",
        },
        {
          id: 2,
          name: "BEFORE",
        },
        {
          id: 3,
          name: "AFTER",
        },
        {
          id: 4,
          name: "BETWEEN",
        },
      ],
    },
    {
      id: 7,
      name: "MODIFICATION_DATE",
      type: 'date',
      subMenu: [
        {
          id: 1,
          name: "EXACTLY",
        },
        {
          id: 2,
          name: "BEFORE",
        },
        {
          id: 3,
          name: "AFTER",
        },
        {
          id: 4,
          name: "BETWEEN",
        },
      ],
    },
  ];

  param2List = [];
  searchFilterForm: FormGroup;
  searchParam = '';
  preSelectList = [];
  message: string = '';
  updated: boolean = false;
  submitted: boolean;
  submittedForm: boolean;
  presetSelected: string = '';
  searchParamId: any;
  id: any;
  isDate: boolean = false;
  modBetween: boolean = false;
  mod: boolean = false;
  dates = ['SHOOTING_DATE', 'CREATION_DATE', 'MODIFICATION_DATE'];
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initPriceForm()
    this.updatePreselectList()
    this.onPreselectDDLChange(1);
  }

  createDatePicker(i, date?: any) {
    const presetDate = date && date.param3 ? date.param3.split(" - ") : []
    const picker = new easepick.create({
      element: "#datepicker" + i,
      css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css",
      ],
      zIndex: 99,
      plugins: [
        "AmpPlugin",
        "RangePlugin"
      ],
    })

    picker.on('select', (date) => {
      this.allSearch().controls[i].get('param3').setValue(date.detail.start.toLocaleString().split(",")[0] + " - " + date.detail.end.toLocaleString().split(",")[0])
    });

    picker.on('show', () => {
      let startDate = presetDate[0] ? new Date(presetDate[0]) : new Date()
      let endDate = presetDate[1] ? new Date(presetDate[1]) : new Date()
      if (startDate) {
        startDate.setMonth(startDate.getMonth());
        picker.setDateRange(startDate, endDate);
      }
    });
  }

  get f() { return this.searchFilterForm.controls; }

  addRow(flag?: boolean) {
    this.submitted = false
    if (flag) {
      if (this.allSearch().controls.length > 0) return;
      this.addSearch({ param1: '', param2: '', param3: '', param4: '' })
      return
    }
    this.addSearch({ param1: '', param2: '', param3: '', param4: '' })
  }

  removeRow(index: any) {
    if (!Object.values(this.allSearch().get(String(index)).value).some(s => s !== '')) {
      this.allSearch().removeAt(index)
      return
    }
    if (confirm('Do you want remove row?')) {
      this.allSearch().removeAt(index)
      this.UpdateSearchByRemoving(index)

    }
  }



  deletePreset() {
    let messageSpan = document.getElementById("message");
    const localData: any = localStorage.getItem("presetSearch");
    const localJSON = JSON.parse(localData);
    let checkIfExist = localJSON.filter(ele => ele?.id == this.id);
    if (localJSON.length > 0) {
      if (checkIfExist && checkIfExist?.length > 0) {
        const temp1 = localJSON[this.searchParam];
        let data = localJSON.filter(ele => ele?.id != this.id);
        if (confirm(`Are you sure to delete ${this.searchParam} preset.`)) {

          localStorage.setItem("presetSearch", JSON.stringify(data));
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
        this.message = !this.searchParam ? 'Please select preset to delete.' : `${this.searchParam} is not present in preset list.`;
        if (this.message) {
          setTimeout(() => {
            this.message = '';
          }, 5000)
        }
      }
    }
    else {
      messageSpan.style.color = 'red';
      this.message = `No saved presets.`;
    }
  }

  UpdateSearchByRemoving(index: any) {
    const localData: any = localStorage.getItem("presetSearch");
    const localJSON = JSON.parse(localData);

    if (localJSON && localJSON[this.searchParam]) {
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
    this.submitted = false;
    if (!this.searchParam) {
      let isData = false
      const currentFormData = this.allSearch().controls;
      currentFormData.map((m: FormGroup) => {
        if (Object.values(m.value).some(s => s != '')) {
          isData = true
        }
      })

      if (isData) {
        if (!confirm('Do you want to discard changes?')) {
          return
        } else {
          this.allSearch().clear()
        }
      } else {
        this.allSearch().clear()
      }
    } else {
      const localData = localStorage.getItem("presetSearch");
      if (localData && localData != "null") {
        localJSON = JSON.parse(localData);
      }
      if (!localJSON.find(f => f.filterName.toLowerCase() === this.searchParam) || localJSON.find(f => f.filterName.toLowerCase() === this.searchParam)?.length === 0) {
        let isData = false
        const currentFormData = this.allSearch().controls;
        currentFormData.map((m: FormGroup) => {
          if (Object.values(m.value).some(s => s != '')) {
            isData = true
          }
        })

        if (isData) {
          if (!confirm('Do you want to discard changes?')) {
            return
          } else {
            this.allSearch().clear()
          }
        } else {
          this.allSearch().clear()
        }
      }
    }
    let messageSpan = document.getElementById("message");
    var localJSON = [];
    const localData = localStorage.getItem("presetSearch");
    if (localData && localData != "null") {
      localJSON = JSON.parse(localData);
    }
    let selectedData = localJSON.filter(s => s.filterName == this.searchParam);
    if (localJSON?.length > 0 && selectedData && selectedData?.length > 0) {
      const temp1 = selectedData[0]?.filters;
      const temp2 = this.searchFilterForm.value.search;
      if (JSON.stringify(temp1) == JSON.stringify(temp2)) {
        this.allSearch().clear();
        this.searchParam = ''

      }
      else {
        if (confirm("Do you want to clear your unsaved changes to filter: " + this.searchParam)) {
          this.allSearch().clear();
          this.searchParam = ''
        }
        else {
          return
        }
      }
      this.presetSelected = ''
      return
    }

  }
  applyFilter() {
    alert('Apply filter.');
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
      param4: [{ value: item?.param4, disabled: item?.param4 ? false : true }],


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
    row.get('param4').enable()
    if (this.param2List && this.param2List.length > 0) {
      this.param2List[i] = menu?.subMenu
    } else {
      this.param2List.push(menu?.subMenu)
    }
    row.get('param2').markAllAsTouched()
    row.get('param2').markAsDirty()
    row.get('param2').setValue(this.param2List[i][0].name)
  }


  onParam2Change(i: any, data?: any) {
    const row = this.allSearch().controls[i] as FormGroup
    if (row.value.param2.toUpperCase() === "BETWEEN") {
      setTimeout(() => { this.createDatePicker(i, data) }, 100)

    }
  }


  getClass(form: any, key: any) {
    return this
  }

  isDateType(formControl) {
    const param1Obj = this.searchData.find(f => f.name.toLocaleLowerCase()
      === this.allSearch().controls[formControl]?.value?.param1?.toLowerCase())
    if (!param1Obj) return false
    return param1Obj.type === 'date' ? true : false
  }

  isDestinationNeeded(formControl) {
    const param1Obj = this.searchData.find(f => f.name.toLocaleLowerCase()
      === this.allSearch().controls[formControl]?.value?.param1?.toLowerCase())
    if (!param1Obj) return false
    return param1Obj.name.toUpperCase() === 'MODIFICATION_DATE' ? true : false
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
      var localJSON = [];

      const localData = localStorage.getItem("presetSearch");
      if (localData && localData != "null") {
        localJSON = JSON.parse(localData);
      }
      if (localJSON?.length > 0 && localJSON.filter(s => s.filterName == this.searchParam)?.length > 0) {
        const temp1 = localJSON.map((data) => data?.id == this.id ? data?.filters : '')[0];
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

      if (this.preSelectList.some(s => s.filterName == this.searchParam)) {
        if (isModified) {
          debugger
          const finalData = [{ id: Number(this.searchParamId), filterName: this.searchParam, filters: this.searchFilterForm.getRawValue()?.search }];
          let data = localJSON.filter(ele => ele.id != +this.searchParamId);
          data = [...data, ...finalData];
          localStorage.setItem("presetSearch", JSON.stringify(data));
          this.updatePreselectList();
          messageSpan.style.color = 'green'
          this.message = "Your filter updated successfully.";
        }
      }
      else {
        if (!this.preSelectList || this.preSelectList.length === 0) {
          const allFilters = []
          filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
          const finalData = { id: 1, filterName: this.searchParam, filters: this.searchFilterForm.value.search };
          allFilters.push(finalData)
          localStorage.setItem("presetSearch", JSON.stringify(allFilters));
          this.updatePreselectList()
          messageSpan.style.color = 'green';
          this.message = this.updated ? 'Filter updated successfully.' : 'Your Filter stored successfully.';
          // this.searchParam = '';
          if (this.message) {
            setTimeout(() => {
              this.message = '';
            }, 3000)
          }
        } else {

          const allFilters = this.preSelectList
          filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
          const finalData = { id: allFilters[allFilters.length - 1].id + 1, filterName: this.searchParam, filters: this.searchFilterForm.value.search };
          allFilters.push(finalData)
          localStorage.setItem("presetSearch", JSON.stringify(allFilters));
          this.updatePreselectList()
          messageSpan.style.color = 'green';
          this.message = this.updated ? 'Filter updated successfully.' : 'Your Filter stored successfully.';
          // this.searchParam = '';
          if (this.message) {
            setTimeout(() => {
              this.message = '';
            }, 3000)
          }
        }
      }
    }
    else {
      messageSpan.style.color = 'red';
      this.message = 'All fields are mandatory.';
    }
  }

  updatePreselectList() {
    var localJSON = [];
    const localData = localStorage.getItem("presetSearch");
    if (localData && localData != "null") {
      localJSON = JSON.parse(localData);
      this.preSelectList = localJSON
    }

    setTimeout(() => {
      if (this.searchParam)
        this.presetSelected = localJSON.find(f => f.filterName.toLowerCase() === this.searchParam.toLowerCase()).id
        this.searchParamId = this.presetSelected
    }, 1000);

  }

  onPreselectDDLChange(e: any) {
    const changes = this.trackChanges(this.searchParamId);

    if (!changes) {
      if (!confirm("Do you want to discard the current filter changes")) {
        setTimeout(() => {
          this.presetSelected = this.searchParamId
        }, 100);
        return
      }
    }
    this.searchParam = e.target?.options[e.target.selectedIndex]?.text;
    this.id = e?.target?.options[e?.target?.selectedIndex]?.value;
    this.searchParamId = e.target?.value;

    if (this.searchParam && this.searchParam == 'Select') {
      this.allSearch().clear();
    }

    if (this.searchParam && this.searchParam !== 'Select') {
      this.clearFormArray()
      const localData = localStorage.getItem("presetSearch");
      if (localData && localData != "null") {
        var localJSON = JSON.parse(localData);
        const tempArray = [] as any[];
        const currentSelection = localJSON.find(f => f.id == this.searchParamId)

        currentSelection.filters.map((f, index) => {
          const menu = this.searchData.find((fn) => fn.name.toLowerCase() === f.param1.toLowerCase());

          if (this.param2List && this.param2List.length > 0) {
            this.param2List[index] = menu.subMenu
          } else {
            this.param2List.push(menu.subMenu)
          }
          tempArray.push({
            param1: f.param1,
            param2: f.param2,
            param3: f.param3,
            param4: f.param4 ? f.param4 : ''
          });
        })
        tempArray.map((m, i) => {
          this.addSearch(m)
          // if (m.param2 === 'BETWEEN') {
          this.onParam2Change(i, m)
          // }
        })
      }
      else {
        this.allSearch().clear();
      }
    }
  }

  trackChanges = (param: any) => {
    if (!param) return true
    const localData = localStorage.getItem("presetSearch");
    var localJSON = JSON.parse(localData);
    let data = localJSON.find(f => f.id == param)

    if (!data) {
      return false
    }

    if (data?.filters?.length === this.allSearch().controls.length) {
      if (JSON.stringify(data?.filters) !== JSON.stringify(this.allSearch().getRawValue())) {
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
