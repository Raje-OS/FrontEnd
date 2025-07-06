import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ListEntity } from '../model/list.entity';
import { BaseService } from '../../shared/services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService extends BaseService<ListEntity> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.resourceEndpoint = environment.listEndpointPath || '/lists';
  }

  /** Obtiene todas las listas de un usuario */
  getListsByUserId(userId: string): Observable<ListEntity[]> {
    return this.http.get<ListEntity[]>(`${this.resourcePath()}?userId=${userId}`, this.httpOptions);
  }

  /** Agrega contenido (ID) a una lista */
  addContentToList(list: ListEntity, contenidoId: string): Observable<ListEntity> {
    const updatedList = {
      ...list,
      list_content: [...new Set([...list.list_content, contenidoId])]
    };
    return this.update(list.id, updatedList);
  }
  deletelist(id: string): Observable<any> {
    return this.http.delete(`${this.resourcePath()}/${id}`);
  }
  /** Elimina contenido de una lista */
  removeContentFromList(list: ListEntity, contenidoId: string): Observable<ListEntity> {
    const updatedList = {
      ...list,
      list_content: list.list_content.filter(id => id !== contenidoId)
    };
    return this.update(list.id, updatedList);
  }
}
