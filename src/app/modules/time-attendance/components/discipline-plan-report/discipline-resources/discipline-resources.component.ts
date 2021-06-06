import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { DisciplineResource } from '../../../models/discipline-resource';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditService } from '../../../../../services/edit.service';
import { DisciplineResourcesService } from '../../../services/discipline-resources.service';
import { MatDialogRef } from '@angular/material';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { truncate } from 'fs';
import { Project } from 'src/app/models/project';
import { from } from 'rxjs';
import { switchMap, tap, delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-discipline-resources',
  templateUrl: './discipline-resources.component.html',
  styleUrls: ['./discipline-resources.component.css']
})
export class DisciplineResourcesComponent implements OnInit {

  @ViewChild("grid") private grid: GridComponent;
  @ViewChild("projectList") projectList;
  projects: Array<Project>;
  sourceProjs: Array<Project>;
  isLoading: boolean;
  viewModel: any;
  disciplines: Array<DisciplineResource>
  public gridView: GridDataResult;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public editService: EditService,
    public discService: DisciplineResourcesService, public dialogRef: MatDialogRef<DisciplineResourcesComponent>) {
    this.viewModel = {};
    this.disciplines = [];
  }

  public ngOnInit(): void {
    this.getResource();
  }


 /*  public projectSelectionChange(value: Project): void {
    if (isNullOrUndefined(this.viewModel.startDate) || isNullOrUndefined(this.viewModel.endDate) || isNullOrUndefined(value)) {
      return;
    }
    this.isLoading = true;
    this.disciplines = [];
    this.discService.getListByPost('DisciplineResource', { startDate: this.viewModel.startDate, endDate: this.viewModel.endDate, projectId: value.id }).subscribe((result: any) => {
      this.isLoading = false;
      if (result.data.length > 0) {
        this.viewModel.isNew = false;
        this.disciplines = result.data;
        this.gridView = process(this.disciplines, this.gridState);
      }
      else {
        this.viewModel.isNew = true;
        this.GetDisciplines(value.id);
      }
    }, error => {
      this.isLoading = false;
    });
  } */


  getResource() {

    this.isLoading = true;
    this.disciplines = [];
    this.discService.getList('DisciplineResource').subscribe((result: any) => {
      this.isLoading = false;
        this.disciplines = result.data;
        this.gridView = process(this.disciplines, this.gridState);
     
    }, error => {
      this.isLoading = false;
    });
  }

/*   GetDisciplines() {
    this.isLoading = true;
    this.discService.GetEngineeringDisciplines(`${this.viewModel.project.id}`).subscribe((data: any) => {
      this.isLoading = false;
      var indx = 0;
      data.data.forEach((it: any) => {
        var ran = new DisciplineResource();
        ran.id = indx + 1;
        ran.disciplineId = it.id;
        ran.disciplineTitle = it.title;
        ran.projectId = this.viewModel.project.id;
        this.disciplines.push(ran);
      });
      this.gridView = process(this.disciplines, this.gridState);
    }, error => {
      this.isLoading = false;
    });
  } */

  public onStateChange(state: State) {
    this.gridState = state;
    this.gridView = process(this.disciplines, this.gridState);
  }

  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'availableResources': dataItem.availableResources,
      'disciplineTitle': dataItem.disciplineTitle
    });
  }

  save() {
    this.grid.closeCell();
    if (this.disciplines.length > 0) {
     /*  if (this.viewModel.isNew) {
        _.forEach(this.disciplines, x => {
          x.id = 0;
          x.startDate = this.viewModel.startDate;
          x.endDate = this.viewModel.endDate;
        });
      } */
      this.isLoading = true;
      this.discService.batchSave(this.disciplines).subscribe(result => {
        this.dialogRef.close(true);
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        var errMessage = '';
        if (error.error.length > 0)
          error.error.forEach((err: string) => errMessage = errMessage + err + '\n');
        else
          errMessage = error.error.ExceptionMessage;

        alert(errMessage);
      });
    }
  }

}
