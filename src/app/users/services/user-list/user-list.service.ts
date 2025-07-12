import { Injectable } from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import { UserListEntity } from '../../model/user-list/user-list.entity';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const listResourceEndpoint = environment.listEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class ListService extends BaseService<UserListEntity> {
  constructor(protected override http: HttpClient) {
    super();
    this.resourceEndpoint = listResourceEndpoint;
  }

  getListsByUserId(userId: string): Observable<UserListEntity[]> {
    const url = `${environment.serverBaseUrl}${this.resourceEndpoint}/${userId}`;
    return this.http.get<UserListEntity[]>(url);
  }
}
