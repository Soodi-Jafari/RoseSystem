import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig} from '@angular/material';
import { MrpitemDetailComponent } from './mrpitem-detail/mrpitem-detail.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MrpItem } from '../../models/mrp-item';
import { MRP } from '../../models/mrp';
import { MRPItemService } from '../../services/mrp-item.service';

@Component({
  selector: 'app-mrpitems',
  templateUrl: './mrpitems.component.html',
  styleUrls: ['./mrpitems.component.css']
})
export class MrpitemsComponent implements OnInit {

   displayedColumns: string[] = ['select','item','tagNo', 'estWeight', 'estUnitPrice', 'quantity','estCurrency'];  
  mrpitems = new MatTableDataSource<MrpItem>();
  selection = new SelectionModel<MrpItem>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() mrp: MRP;
  
  constructor(private dialog: MatDialog,private mrpItemService : MRPItemService) {
  }

  ngOnInit() {
    this.getMRPItems();
  }

  getMRPItems(): void {
    this.mrpItemService.getList('GetMRTItems', this.mrp.id.toString())
    .subscribe( (result : any) =>  {
        this.mrpitems = result.data;   
        this.mrpitems.paginator = this.paginator;     
    });
  }
  
  public new()
  {
    this.openDetail(null);
  }

  public edit()
  {
    if (this.selection.selected.length > 0)
    {
       this.openDetail(this.selection.selected[0]);
    } 
  }

  public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "800px";
    dialogConfig.height = "480px";
    dialogConfig.data =  {mrp : this.mrp,mrpItem : row};

    const dialogRef = this.dialog.open(MrpitemDetailComponent, dialogConfig);
     dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`); 
        if (result !== null)
         this.getMRPItems();
      });       
   }

 delete()
  {
    if (this.selection.selected.length > 0)
    { 
     var item = this.selection.selected[0];
     if(confirm(`Are you sure to delete  "${item.item.title}"`)) {
        this.mrpItemService.Delete(item).subscribe( result => {
           this.getMRPItems();
         }, error => {  
           alert(`Document "${item.item.title}" is used. Could not be deleted.`);
       });
     }
    }
  } 
}



