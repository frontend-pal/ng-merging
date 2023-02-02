import { Component } from '@angular/core';
import { ApiService, attachment } from 'src/services/api.service';
import { PdfFileService } from 'src/services/pdf-file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-merging';

  constructor(
    private api: ApiService,
    private fileService: PdfFileService
  ) { }

  getItems() {
    this.api.getNombreDelServicio().subscribe(res => {
      // const onePdf = res[0].onBase64;

      if (!!res && res.length > 0) {
        this.downloadItems(res);
      } else {
        console.log('la respuesta esta vacia');
      }
    }, err => console.log(err))
  }

  downloadItems(attachment: attachment[]) {
    const ArrayAttach = attachment.map(attach => {
      return this.fileService.getOnlyBase64String(attach);
    });

    console.log(ArrayAttach);

    const arrayBufferArray: any[] = ArrayAttach.map(arrayBuff => {
        return this.fileService.base64ToArrayBuffer(arrayBuff);
    });
    
    console.log(arrayBufferArray);

    this.fileService.mergePdfs(arrayBufferArray).then(res => {
      console.log(res);
      this.fileService.showFile(res);
    });
    console.log(" aqui pasa algo");
  }

}
