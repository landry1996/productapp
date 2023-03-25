import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model';
import {UUID} from 'angular2-uuid';
import { ValidationErrors } from '@angular/forms';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products !: Array<Product>;

  constructor() {

    this.products=[

      {id: UUID.UUID(), name: "computer", price: 6500, promotion: true},

      {id: UUID.UUID(), name: "printer", price:  1200, promotion: false},

      {id: UUID.UUID(), name: "Smart phone", price: 2400, promotion: true}

    ];

    for (let i = 0 ; i<10 ; i++){
      this.products.push( {id: UUID.UUID(), name: "computer", price: 6500, promotion: true});
      this.products.push( {id: UUID.UUID(), name: "printer", price:  1200, promotion: false});
      this.products.push( {id: UUID.UUID(), name: "Smart phone", price: 2400, promotion: true});


    }

  }

  public getAllproducts(): Observable<Product[]>{

    return of([...this.products]);
  }

  public getPageProducts(page : number, size : number): Observable<PageProduct>{

    let index = page*size;

    let totalPages = ~~(this.products.length/size) ;
    if (this.products.length !=0) {
      totalPages++;
    }
    let pageProducts = this.products.splice(index,index+size);
    return of({ page: page, size : size, totalPages : totalPages, products : pageProducts});

  }

  public deletProduct(id: string) : Observable<boolean>{
   this.products = this.products.filter(p=>p.id!=id);

   return of(true);
  }

  public setPromotion(id : string) : Observable<boolean>{

    let product = this.products.find(p=>p.id==id);

    if(product!=undefined){
      product.promotion != product.promotion;

      return of(true);
    }
    else
    return throwError(()=>new Error("product not found"));
  }

  public searchProducts(Keyword: string, page : number, size : number) : Observable<PageProduct>{

    let result = this.products.filter(p=>p.name.includes(Keyword));

    let index = page*size;

    let totalPages = ~~(result.length/size) ;
    if (this.products.length !=0) {
      totalPages++;
    }
    let pageProducts = result.splice(index,index+size);
    return of({ page: page, size : size, totalPages : totalPages, products : pageProducts});



  }
  public addNewProduct(product: Product): Observable<Product>{
product.id=UUID.UUID();
this.products.push(product);
return of(product);
  }

  public getProduct(id : string) : Observable<Product>{
     let product= this.products.find(p=>p.id==id);
     if(product==undefined) return throwError(()=>new Error("Product not found"));

     return of(product);
  }

  public getErrorMessage( fieldname: string, error : ValidationErrors){
    if( error['required']){
      return fieldname +" is required";
    }
    else if (error['minlenght']){
      return fieldname + "should have at least"+error['minlenght']['requiredLenght']+"Charaters";
    }
    else if (error['min']){
      return fieldname + "should have min value"+error['min']['min'];
    }
    else return "";


    }

    public updateProduct(product : Product) : Observable<Product>{
       this.products= this.products.map(p=>(p.id==product.id)?product:p );
       return of(product);
    }

}
