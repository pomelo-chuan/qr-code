import React, {Component} from "react";
import {
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeadCell,
  TableDataCell,
  Cutout,
} from 'react95';
import store from 'store';
import copy from 'copy-to-clipboard';
import observerPlugin from 'store/plugins/observe';

store.addPlugin(observerPlugin);


class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [],
    };
    this.delete = this.delete.bind(this);
    this.copy = this.copy.bind(this);
  }

  componentDidMount() {
    store.observe('collection', (val) => {
      if (val) {
        this.setState({
          collection: val
        })
      }
    });
  }

  delete(url) {
    const collection = store.get('collection');
    store.set('collection', collection.filter(it => it !== url))
  }

  copy(url) {
    copy(url);
  }

  render() {
    const {
      collection
    } = this.state;
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow head>
              <TableHeadCell>序号</TableHeadCell>
              <TableHeadCell>链接</TableHeadCell>
              <TableHeadCell>操作</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collection.map((it, index) => <TableRow key={index}>
              <TableDataCell style={{textAlign: 'center'}}>
              <span role='img' aria-label='LEAF'>
                {index + 1}
              </span>
              </TableDataCell>
              <TableDataCell>{it}</TableDataCell>
              <TableDataCell style={{textAlign: 'center'}}>
                <Button onClick={() => this.delete(it)}>删除</Button>
                <Button onClick={() => this.copy(it)}>复制</Button>
              </TableDataCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default Collection;
