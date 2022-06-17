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
      id: "CLIP_NOTES",
      name: "Clip Notes",
      type: 'text',
      subMenu: [
        {
          id: "CONTAINS",
          name: "Contains",
        },
        {
          id: "CONTAINS_WORDS",
          name: "Contains Words",
        },
        {
          id: "IS",
          name: "Is",
        },
        {
          id: "BEGIN_WITH",
          name: "Begin With",
        },
        {
          id: "ENDS_WITH",
          name: "Ends With",
        },
        {
          id: "IS_NOT",
          name: "Is Not",
        },
      ],
    },
    {
      id: "FRAME_NOTES",
      name: "Frame Notes",
      type: 'text',
      subMenu: [
        {
          id: "CONTAINS",
          name: "Contains",
        },
        {
          id: "CONTAINS_WORDS",
          name: "Contains Words",
        },
        {
          id: "IS",
          name: "Is",
        },
        {
          id: "BEGIN_WITH",
          name: "Begin With",
        },
        {
          id: "ENDS_WITH",
          name: "Ends With",
        },
        {
          id: "IS_NOT",
          name: "Is Not",
        }
      ],
    },
    {
      id: "TRANSCRIPTS",
      name: "Transcripts",
      type: 'text',
      subMenu: [
        {
          id: "CONTAINS",
          name: "Contains",
        },
        {
          id: "CONTAINS_WORDS",
          name: "Contains Words",
        },
        {
          id: "IS",
          name: "Is",
        },
        {
          id: "BEGIN_WITH",
          name: "Begin With",
        },
        {
          id: "ENDS_WITH",
          name: "Ends With",
        },
        {
          id: "IS_NOT",
          name: "Is Not",
        }
      ],
    },
    {
      id: "FILE_NAME",
      name: "File Name",
      type: 'text',
      subMenu: [
        {
          id: "CONTAINS",
          name: "Contains",
        },
        {
          id: "IS",
          name: "Is",
        },
        {
          id: "BEGIN_WITH",
          name: "Begin With",
        },
        {
          id: "ENDS_WITH",
          name: "Ends With",
        },
        {
          id: "IS_NOT",
          name: "Is Not",
        }
      ],
    },
    {
      id: "DURATION",
      name: "Duration",
      type: 'time',
      subMenu: [
        {
          id: "LONGER_THAN",
          name: "Longer Than",
        },
        {
          id: "SHORTER_THAN",
          name: "Shorter Than",
        },
        {
          id: "SHOW_TOTAL_DURATION_FOR_SELECTION",
          name: "Show Total Duration For Selection",
        },
      ],
    },
    {
      id: "CARD_SERIAL",
      name: "Card Serial",
      type: 'text',
      subMenu: [
        {
          id: "CONTAINS",
          name: "Contains",
        },
        {
          id: "IS",
          name: "Is",
        },
        {
          id: "IS_NOT",
          name: "Is Not",
        },
      ],
    },
    {
      id: "RECORDER_SERIAL",
      name: "Recorder Serial",
      type: 'text',
      subMenu: [
        {
          id: "CONTAINS",
          name: "Contains",
        },
        {
          id: "IS",
          name: "Is",
        },
        {
          id: "IS_NOT",
          name: "Is Not",
        },
      ],
    },
    {
      id: "SHOOTING_DATE",
      name: "Shooting Date",
      type: 'date',
      subMenu: [
        {
          id: "EXACTLY",
          name: "Exactly",
        },
        {
          id: "BEFORE",
          name: "Before",
        },
        {
          id: "AFTER",
          name: "After",
        },
        {
          id: "BETWEEN",
          name: "Between",
        }
      ],
    },
    {
      id: "CREATION_DATE",
      name: "Creation Date",
      type: 'date',
      subMenu: [
        {
          id: "EXACTLY",
          name: "Exactly",
        },
        {
          id: "BEFORE",
          name: "Before",
        },
        {
          id: "AFTER",
          name: "After",
        },
        {
          id: "BETWEEN",
          name: "Between",
        }
      ],
    },
    {
      id: "MODIFICATION_DATE",
      name: "Modification Date",
      type: 'date',
      subMenu: [
        {
          id: "EXACTLY",
          name: "Exactly",
        },
        {
          id: "BEFORE",
          name: "Before",
        },
        {
          id: "AFTER",
          name: "After",
        },
        {
          id: "BETWEEN",
          name: "Between",
        }
      ],
    },
  ];

  param2List = [];
  searchFilterForm: FormGroup;
  searchParam = '';
  preSelectList = [];
  message: string = '';
  updated: boolean = false;
  submitted: boolean = false;
  submittedForm: boolean;
  presetSelected: string = '';
  searchParamId: any;
  id: any;
  isDate: boolean = false;
  modBetween: boolean = false;
  mod: boolean = false;
  isParam2Select:boolean = false;
  dates = ['Shooting Date', 'Creation Date', 'Modification Date'];
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
      if (this.allSearch().length == 1) {
        this.allSearch().removeAt(index)
        this.UpdateSearchByRemoving(index)

        const localData: any = localStorage.getItem("presetSearch");
        const localJSON = JSON.parse(localData);

        let data = localJSON.filter(ele => ele?.id != this?.id);
        localStorage.setItem("presetSearch", JSON.stringify(data));
        this.updatePreselectList();
        this.searchParam = ''
      }
      else {
        this.allSearch().removeAt(index)
        this.UpdateSearchByRemoving(index)
      }
    }
  }

  deletePreset() {
    debugger
    let messageSpan = document.getElementById("message");
    const localData: any = localStorage.getItem("presetSearch");
    const localJSON = JSON.parse(localData);


    if (localJSON && localJSON.length > 0) {
      let ele = localJSON?.find(f => f.id == this.presetSelected);
      if (localJSON.find(s => s.filterName == this.presetSelected ) || ele) {
        let checkIfExist = localJSON.filter(ele => ele?.id == this.id);
        if (checkIfExist && checkIfExist?.length > 0) {

          if (confirm(`Are you sure to delete ${this.searchParam} preset.`)) {
            let data = localJSON.filter(ele => ele?.id != this?.id);
            localStorage.setItem("presetSearch", JSON.stringify(data));
            messageSpan.style.color = 'red'
            this.message = `'${this.searchParam}' is deleted successfully.`;
            if (this.message) {
              setTimeout(() => {
                this.message = '';
              }, 3000)
            }
            this.presetSelected = '';
            this.searchParam = '';

            this.allSearch().clear();
            this.updatePreselectList();
          }
        }
      }
      else {
        messageSpan.style.color = 'red';
        this.message = 'Preset does not exist.';
        if (this.message) {
          setTimeout(() => {
            this.message = '';
          }, 5000)
        }
      }
    }
    else {
      messageSpan.style.color = 'red';
      this.message = `Preset does not exist.`;
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
    debugger
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
      if (localData && localData != null) {
        localJSON = JSON.parse(localData);
      }
      if (!localJSON?.find(f => f.filterName?.toLowerCase() === this?.searchParam) || localJSON.find(f => f.filterName?.toLowerCase() === this?.searchParam)?.length === 0) {
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
            this.presetSelected = ''
            this.updatePreselectList();
            
          }
        } else {
          this.allSearch().clear()
          this.presetSelected = ''
          this.updatePreselectList();

        }
      }
    }
    var localJSON = [];
    const localData = localStorage.getItem("presetSearch");
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    let selectedData = localJSON.filter(s => s.filterName == this.searchParam);
    if (localJSON?.length > 0 && selectedData && selectedData?.length > 0) {
      let temp1 = selectedData[0]?.filters;
      const temp2 = this.searchFilterForm.value.search;

      for (var i = 0, len = temp1.length; i < len; i++) {
        if (temp1[i].param4 == '') {
          delete temp1[i].param4;
        }
      }

      if (JSON.stringify(temp1) == JSON.stringify(temp2)) {
        this.allSearch().clear();
        this.searchParam = ''

      }
      else {
        for (var i = 0, len = temp1.length; i < len; i++) {
          if (temp2[i].param4 == '') {
            delete temp2[i].param4;
          }
        }
        if (JSON.stringify(temp1) !== JSON.stringify(temp2)) {
          if (confirm("Do you want to clear your unsaved changes to filter: " + this.searchParam)) {
            this.allSearch().clear();
            this.searchParam = ''
          }
          else {
            return false
          }

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
    debugger
    if(i==0){
      this.isParam2Select = true;
    }
    const row = this.allSearch().controls[i] as FormGroup
    const menu = this.searchData.find(f => f.id.toLowerCase() === row.get('param1').value.toLowerCase())
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
    row.get('param2')?.setValue(this?.param2List[i][0]?.id)
    
  }

  onParam2Change(i: any, data?: any) {
    debugger
    const row = this.allSearch().controls[i] as FormGroup
    if (row.value.param2.toLowerCase() === "BETWEEN".toLowerCase()) {
      setTimeout(() => { this.createDatePicker(i, data) }, 100)
    }
  }

  isDateType(formControl) {
    const param1Obj = this.searchData.find(f => f.id
      === this.allSearch().controls[formControl]?.value?.param1)
    if (!param1Obj) return false
    return param1Obj.type === 'date' ? true : false
  }

  isDestinationNeeded(formControl) {
    const param1Obj = this.searchData.find(f => f.id.toLowerCase()
      === this.allSearch().controls[formControl]?.value?.param1?.toLowerCase())
    if (!param1Obj) return false
    return param1Obj.id === 'MODIFICATION_DATE' ? true : false
  }

  getValue(event: any, fc: any) {
    let param1DurationObj = this.searchFilterForm.value.search[0].param1 === 'DURATION';
    if (param1DurationObj) {

      let value = event.target.value
      if (value.length === 1 && parseInt(value) != NaN) {
        this.allSearch().controls[fc].get("param3").setValue(value + 'h');
      } else if (value.split('h').length > 1 && value.split('m').length < 2 && parseInt(value.split('h')[1]) != NaN) {
        this.allSearch().controls[fc].get("param3").setValue(value + 'm');
      } else if (value.split('m').length > 1 && value.split('s').length < 2 && parseInt(value.split('m')[1]) != NaN) {
        this.allSearch().controls[fc].get("param3").setValue(value + 's');
      } else {
        alert("The Duration should be HH MM SS and 24h clock");
      }
    }
  }

  savePreselectForm() {
    this.submitted = true;
    if (!this.allSearch().valid) {
      return;
    }
    let filterData: FilterModel[] = this.searchFilterForm.value.search as FilterModel[]
    let every = filterData.every((m) => m.param1 !== '' && m.param2 !== '' && m.param3 !== '');
    let messageSpan = document.getElementById("message");
    // let isModified = true;
    debugger
    if (every) {
      var localJSON = [];
      const localData = localStorage.getItem("presetSearch");
      if (localData && localData != null) {
        localJSON = JSON.parse(localData);
      }
      if (localJSON?.length > 0 && localJSON.filter(s => s.filterName == this.searchParam)?.length > 0) {
        const temp1 = localJSON.map((data) => data?.id === this.id ? data?.filters : '')[0];
        const temp2 = this.searchFilterForm.value.search;
        if (JSON.stringify(temp1) == JSON.stringify(temp2)) {
          // messageSpan.style.color = 'green';
          this.message = 'Your Filter stored successfully';
          if (this.message) {
            setTimeout(() => {
              this.message = '';
            }, 3000)
          }
          return
        } else {
          alert('Preset already exists.');
          return false;
        }
      }
      if (!this.preSelectList || this.preSelectList.length === 0) {
        const allFilters = []
        filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
        const finalData = { id: this.searchParamId ? this.searchParamId : 1, filterName: this.searchParam, filters: this.searchFilterForm.value.search };
        allFilters.push(finalData)
        localStorage.setItem("presetSearch", JSON.stringify(allFilters));
        this.updatePreselectList()
        messageSpan.style.color = 'green';
        this.message = 'Your Filter stored successfully.';
        // this.searchParam = '';
        if (this.message) {
          setTimeout(() => {
            this.message = '';
          }, 3000)
        }
      }
      else {
        const allFilters = this.preSelectList
        filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
        const finalData = { id: allFilters[allFilters.length - 1].id + 1, filterName: this.searchParam, filters: this.searchFilterForm.value.search };
        allFilters.push(finalData)
        localStorage.setItem("presetSearch", JSON.stringify(allFilters));
        this.updatePreselectList()
        messageSpan.style.color = 'green';
        this.message = 'Your Filter stored successfully.';
        // this.searchParam = '';
        if (this.message) {
          setTimeout(() => {
            this.message = '';
          }, 3000)
        }
      }
    }
  }
  saveAsNewPreset() {
    debugger
    const localData: any = localStorage.getItem("presetSearch");
    const localJSON = JSON.parse(localData);
    if (localJSON && localJSON.length > 0) {
      let checkIfExist = localJSON.filter(ele => ele?.id == this.id);
      if (checkIfExist || checkIfExist?.length > 0) {
        let filterData: FilterModel[] = this.searchFilterForm.value.search as FilterModel[]
        let messageSpan = document.getElementById("message");
        let presetName = this.searchParam
        const allSameNameKeys = localJSON.filter(d => d.filterName.search(this.searchParam) > -1)
        if (allSameNameKeys) {
          const allKeys = allSameNameKeys.map(m => m.filterName)
          this.presetSelected = this.searchParam;
          if (allKeys[allKeys.length - 1]?.split("_").length === 1) {
            presetName += "_copy"
          }
          if (allKeys[allKeys.length - 1]?.split("_").length > 1 && allKeys[allKeys.length - 1]?.split("_")[1].length === 4) {
            presetName = allKeys[allKeys.length - 1].split("_")[0] + "_copy1"
          }
          if (allKeys[allKeys.length - 1]?.split("_").length > 1 && allKeys[allKeys.length - 1]?.split("_")[1].length > 4) {
            let newIndex = allKeys[allKeys.length - 1][allKeys[allKeys.length - 1].length - 1]
            newIndex++
            presetName = allKeys[allKeys.length - 1]?.split("_")[0] + "_copy" + newIndex
          }
        }
        const allFilters = this.preSelectList
        filterData = filterData.filter(data => data?.param1 && data?.param2 && data?.param3);
        const finalData = { id: allFilters[allFilters.length - 1].id + 1, filterName: presetName, filters: this.searchFilterForm.value.search };
        allFilters.push(finalData)
        localStorage.setItem("presetSearch", JSON.stringify(allFilters));
        this.updatePreselectList()
        messageSpan.style.color = 'green';
        this.message = 'Your Filter stored successfully.';
        
        // let ele = localJSON?.find(f => f.id == this.presetSelected);
        // let len = ele.filterName.indexOf('_');
        
        // console.log(ele.filterName);
        // let pre = this.preSelectList.length - 1;
        // console.log(pre);
        // if(len) {
        //   this.presetSelected = localJSON?.find(f => f.filterName?.toLowerCase() === this.searchParam?.toLowerCase())?.id + pre ;
        // }
        // else {
        //   this.presetSelected = localJSON?.find(f => f.filterName?.toLowerCase() === this.searchParam?.toLowerCase())?.id + 1;
        // }


        // this.presetSelected = localJSON?.find(f => f.filterName?.toLowerCase() === this.searchParam?.toLowerCase())?.;
        
        this.searchParam = presetName;
        setTimeout(() => {
          this.message = '';
        }, 3000)
      }
    }
  }

  async updateCurrentPreset() {
    debugger
    this.submitted = true;
    if (!this.allSearch().valid) {
      return;
    }
    let filterData: FilterModel[] = this.searchFilterForm.value.search as FilterModel[]
    let every = filterData.every((m) => m.param1 !== '' && m.param2 !== '' && m.param3 !== '');
    let messageSpan = document.getElementById("message");
    let isModified = true;
    if (every) {
      var localJSON = [];
      const localData = localStorage.getItem("presetSearch");
      if (localData && localData != null) {
        localJSON = JSON.parse(localData);
      }
      debugger
      if (localJSON?.length > 0 && localJSON.filter(s => s.filterName == this.searchParam)?.length > 0) {
        let temp = localJSON.find((s) => s.filterName == this.searchParam);
        let temp1 = temp.filters;
        const temp2 = this.searchFilterForm.value.search;
        for (var i = 0, len1 = temp1.length; i < len1; i++) {
          if (temp1[i].param4 == '') {
            delete temp1[i].param4;
          }
        }
        for (var i = 0, len2 = temp2.length; i < len2; i++) {
          if (temp2[i].param4 == '') {
            delete temp2[i].param4;
          }
        }

        if (JSON.stringify(temp1) == JSON.stringify(temp2)) {
          messageSpan.style.color = 'green';
          this.message = 'Your Filter stored successfully';
          if (this.message) {
            setTimeout(() => {
              this.message = '';
            }, 3000)
          }
          return
        } 
        else {
          isModified = confirm("Your are updating the current filter: " + this.searchParam + " Please confirm");
        }
      }
      if (this.preSelectList.some(s => s.filterName == this.searchParam)) {
        if (isModified) {
          const finalData = [{ id: String(this.searchParamId), filterName: this.searchParam, filters: this.searchFilterForm.getRawValue()?.search }];
          let data = localJSON.filter(ele => ele.id != +this.searchParamId);
          data = [...data, ...finalData];
          localStorage.setItem("presetSearch", JSON.stringify(data));
          this.updatePreselectList();
          messageSpan.style.color = 'green'
          
          this.message = "Your filter updated successfully.";
          if (this.message) {
           await setTimeout(() => {
              this.message = '';
            }, 3000)
          }
        }
      }
      else {
        const finalData = [{ id: String(this.searchParamId), filterName: this.searchParam, filters: this.searchFilterForm.getRawValue()?.search }];
          let data = localJSON.filter(ele => ele.id != +this.searchParamId);
          data = [...data, ...finalData];
          localStorage.setItem("presetSearch", JSON.stringify(data));
          this.updatePreselectList();
          messageSpan.style.color = 'green'
          this.message = "Your Filter stored successfully.";
          if (this.message) {
           await setTimeout(() => {
              this.message = '';
            }, 3000)
          }
      }
    }    
  }


  updatePreselectList() {
    var localJSON = [];

    const localData = localStorage.getItem("presetSearch");
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
      this.preSelectList = localJSON
    }
    if (this.searchParam.toLowerCase()) {
      this.presetSelected = localJSON?.find(f => f.filterName?.toLowerCase() === this.searchParam?.toLowerCase())?.id
      this.searchParamId = this.presetSelected;
      // this.presetSelected = this.searchParam;
    }

  }

  onPreselectDDLChange(e: any) {
    debugger
    const changes = this.trackChanges(this.searchParamId);

    if (!changes) {
      if (this.searchParam && this.searchParam !== 'Select') {
        if (!confirm("Do you want to discard the current filter changes")) {
          setTimeout(() => {
            this.presetSelected = this.searchParamId
          }, 100);
          return
        }
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
      if (localData && localData != null) {
        var localJSON = JSON.parse(localData);
        const tempArray = [] as any[];
        const currentSelection = localJSON.find(f => f.id == this.searchParamId)

        currentSelection?.filters?.map((f, index) => {
          const menu = this.searchData.find((fn) => fn.id.toLowerCase() === f.param1.toLowerCase());
          // .split('_').join(' '));
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
          this.onParam2Change(i, m);
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
      const temp1 = this.allSearch().getRawValue();
      const temp2 = data?.filters;

      for (var i = 0, len1 = temp1.length; i < len1; i++) {
        if (temp1[i].param4 == '') {
          delete temp1[i].param4;
        }
      }
      for (var i = 0, len2 = temp2.length; i < len2; i++) {
        if (temp2[i].param4 == '') {
          delete temp2[i].param4;
        }
      }

      if (JSON.stringify(temp1) !== JSON.stringify(temp2)) {
        return false
      }
      else {
        return true;
      }
    }
    return false;
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
