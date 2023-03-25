import { Component,OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import {FormControl,FormGroup,FormBuilder,Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  /*variable*/
  products !: Array<Product>;
  currentPage : number = 0;
  pageSize : number = 5 ;
  totalPages : number = 0;
  errorMessage !: string;
 searchFormGroup !: FormGroup;
 currentAction : string="all";

  constructor(private productService: ProductService, private fb : FormBuilder ,
    public authService: AuthenticationService, private router : Router){}

  ngOnInit(): void {

    this.searchFormGroup=this.fb.group({

      Keyword : this.fb.control(null)

    });

   this.handlegetPageProducts();

  }

  handlegetPageProducts(){

    this.productService.getPageProducts(this.currentPage, this.pageSize).subscribe({
      next : (data)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
        console.log(this.totalPages);
      },
      error : (err)=>{
        this.errorMessage=err;
      }
    });

  }

  handlegetAllProduct(){

    this.productService.getAllproducts().subscribe({
      next : (data)=>{
        this.products=data;
      },
      error : (err)=>{
        this.errorMessage=err;
      }
    });

  }

  handleDeletproduct(p : Product){

    let conf = confirm("Are You Sure to delete ?");
    if(conf==false) return;

    this.productService.deletProduct(p.id).subscribe({

      next: (data)=>{

        //this.handlegetAllProduct();

        let index = this.products.indexOf(p);
        this.products.splice(index, 1);

      }
    });
 }

  handleSetPromotion(p : Product){

    let promo = p.promotion

    this.productService.setPromotion(p.id).subscribe({

      next : (data)=>{
        p.promotion=!promo;
      },
      error : err=>{
        this.errorMessage=err;
      }
    });

  }
  handleSearchProducts(){
    this.currentAction="search";
    let Keyword=this.searchFormGroup.value.Keyword;
    this.productService.searchProducts(Keyword, this.currentPage, this.pageSize).subscribe({
      next: (data)=>{
        this.products=data.products;
        this.totalPages = data.totalPages;
      }
    })
  }

  gotoPage(i : number){

    this.currentPage=i;
    if (this.currentAction==='all') {
      this.handlegetPageProducts();
    }
    else

    this.handleSearchProducts();


}
public handleNewProduct(){
this.router.navigateByUrl("/admin/newProduct");
}
handleEditProduct(p:Product){
   this.router.navigateByUrl("/admin/editProduct"+p.id);
}


}
