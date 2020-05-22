import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { KuzzleService } from './kuzzle.service';

@Injectable({
  providedIn: 'root',
})
export class KuzzleFilesService {
  constructor(
    public kuzzleService: KuzzleService,
    private httpClient: HttpClient
  ) {}

  getFilesPath(): Observable<string[]> {
    return from(
      ((this.kuzzleService.kuzzle.query({
        controller: 's3/file',
        action: 'getFilesKeys',
      }) as unknown) as Promise<{
        result: { filesKeys: Array<{ Key: string }> };
      }>).then((result) => result.result.filesKeys.map((k) => k.Key))
    );
  }

  getUploadUrl(
    file: File,
    uploadDir: string
  ): Observable<{
    result: { fileKey: string; uploadUrl: string; fileUrl: string };
  }> {
    return from(
      (this.kuzzleService.kuzzle.query({
        controller: 's3/upload',
        action: 'getUrl',
        uploadDir,
        filename: file.name,
      }) as unknown) as Promise<{
        result: { fileKey: string; uploadUrl: string; fileUrl: string };
      }>
    );
  }

  uploadFile(file: File, uploadUrl: string): Observable<HttpEvent<{}>> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': file.type }),
      reportProgress: true,
    };
    const req = new HttpRequest('PUT', uploadUrl, file, options);
    return this.httpClient.request(req);
  }

  validateFile(fileKey: string) {
    return from(
      (this.kuzzleService.kuzzle.query({
        controller: 's3/upload',
        action: 'validate',
        fileKey,
      }) as unknown) as Promise<any>
    );
  }
}
