import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-list-generic',
  templateUrl: './list-generic.component.html',
  styleUrl: './list-generic.component.scss',
})
export class ListGenericComponent implements OnInit {
  files!: TreeNode[];

  cols!: Column[];

  ngOnInit() {
    this.files = [];
    for (let i = 0; i < 50; i++) {
      let node = {
        data: {
          name: 'Item ' + i,
          size: Math.floor(Math.random() * 1000) + 1 + 'kb',
          type: 'Type ' + i,
        },
        children: [
          {
            data: {
              name: 'Item ' + i + ' - 0',
              size: Math.floor(Math.random() * 1000) + 1 + 'kb',
              type: 'Type ' + i,
            },
          },
        ],
      };

      this.files.push(node);
    }

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'type', header: 'Type' },
    ];
  }
}
