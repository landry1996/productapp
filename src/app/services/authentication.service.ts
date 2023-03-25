import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { AppUser } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  users : AppUser[]=[];
  authenticatedUser : AppUser | undefined;

  constructor() {

    this.users.push({userId: UUID.UUID(), username: "user1", password: "1234", roles:["USER"]});
    this.users.push({userId: UUID.UUID(), username: "user2", password: "1234", roles:["USER"]});
    this.users.push({userId: UUID.UUID(), username: "admin", password: "1234", roles:["USER","ADMIN"]});


   }

   public login(username : string, password : string): Observable<AppUser>{

  let appuser = this.users.find(u=>u.username==username);

   if (!appuser) return throwError(()=>new Error("user not found"));

   if (appuser.password!=password){
    return throwError(()=>new Error("Bad credentials"));
   }
   return of(appuser);
   }

   public authenticateUser(appuser : AppUser) : Observable<boolean>{

     this.authenticatedUser=appuser;
     localStorage.setItem("authUser", JSON.stringify({username:appuser.username, roles:appuser.roles, jwt:"JWT-TOKEN"}));
     return of(true);


   }
   public hasRole(role :string) : boolean{
   return this.authenticatedUser!.roles.includes(role);

}
public isAuthenticated(){

  return this.authenticatedUser!=undefined;
}
public logout() : Observable<boolean>{
this.authenticatedUser=undefined;
localStorage.removeItem("authUser");

return of(true);

}
}
