import React, { Component } from 'react';
import { Table, Button, Input, message, Modal } from 'antd';
import { PlusOutlined,EditOutlined,DeleteOutlined,SearchOutlined } from '@ant-design/icons';
import Authority from '../../../../Frame/Authority';
import ContoctsService from './Service'
import ContoctsAdd from './Add'
import ContoctsEdit from './Edit'
const {confirm} = Modal
class Contocts extends Component {
    state = {
        dataSource: [],
        pagination:{},
        filters:{},
        sorter:{},
        loading:false,
        addVisible: false,
        editVisible:false,
        selectedRowKeys:[],
        contocts:{},
    }

    componentDidMount = () => {
		this.search();
    }
    
    search = (pagination=this.state.pagination, filters=this.state.filters, sorter=this.state.sorter) => {
        this.setState({ loading: true })
        ContoctsService.pageList({...pagination, ...filters, ...sorter}).then(res => {
			pagination.total = res.total;
			pagination.pageSize = res.pageSize;
			pagination.current = res.current;
			pagination.showTotal = () => `总共${res.total} 条`
			pagination.showQuickJumper = true
			this.setState({
				dataSource: res.list,
                pagination: pagination,                
			})
		}).catch(error => {
			message.error(error.message)
		}).finally(() => {
			this.setState({ loading: false })
		})
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            pagination,filters,sorter
        })
        this.search(pagination, filters, sorter)
    }

    handleReset = clearFilters => {
        clearFilters();
    };

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
      };

    getSearchProps = dataIndex =>({
        filterDropdown:({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input ref={node => {this.searchInput = node;}} value={selectedKeys} 
                onChange={e => setSelectedKeys(e.target.value ? e.target.value : '')}
                onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                style={{ width: 188,marginTop:10, marginBottom: 15, display: 'block' }}/>

                <Button type="primary" onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />} style={{ width: 90, marginRight: 8 }}>查询</Button>

                <Button onClick={() => this.handleReset(clearFilters)} style={{ width: 90 }}>清除</Button>    
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

        onFilterDropdownVisibleChange: visible => {if (visible) {setTimeout(() => this.searchInput.select());}},       

    })

    render() {
        const columns = [   { title: '序号', width: 80, render: (text, record, index) => `${index + 1}`},
		                    { title: '客户', width: 120, dataIndex: 'customerName', key: 'customerName', sorter: true,...this.getSearchProps("customerName")},
		                    { title: '姓名', width: 120, dataIndex: 'name', key: 'name',sorter: true,...this.getSearchProps("name") ,fixed: 'left',},
                            { title: '职位', dataIndex: 'post', key: 'post', sorter: true, width: 120},
                            { title: '部门', dataIndex: 'dept', key: 'dept', sorter: true, width: 120},
                            { title: '性别', dataIndex: 'sex', key: 'sex', sorter: true, width: 120,
                                render: ((data) => {
                                    switch (data) {
                                    case 0:
                                        return '女'
                                    case 1:
                                        return '男'
                                    default:
                                        return "";
                                    }
                                })
                            },
                            { title: '称呼', dataIndex: 'saltName', key: 'saltName', sorter: true, width: 120},
                            { title: '电话', dataIndex: 'telephone', key: 'telephone', sorter: true, width: 150,...this.getSearchProps("telephone") },
                            { title: '创建人', dataIndex: 'createUser', key: 'createUser', width: 100, },
                            { title: '创建时间', dataIndex: 'createTime', key: 'createTime', sorter: true, width: 150, },
                            { title: '修改人', dataIndex: 'updateUser', key: 'updateUser', width: 100, },
                            { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', sorter: true, width: 150, }   
            ];
        return(
            <div className="table-list"> 
               <div className='table-list-top'>
                    <div className='table-list-top-tp'>
                        <Authority authorityId='CONTOCTS_EDIT'>
                            <Button className="table-list-operator-buttom" type="primary" icon={<PlusOutlined />} onClick={this.handleAdd}>新建</Button>
                            <Button className="table-list-operator-buttom" icon={<EditOutlined />} onClick={this.handleEdit}>修改</Button>
                        </Authority>
                        <Authority authorityId='CONTOCTS_DELETE'>
                            <Button className="table-list-operator-buttom" icon={<DeleteOutlined />} onClick={this.handleDelete}>删除</Button>
                        </Authority>
                    </div>
                </div>
				<Table
					dataSource={this.state.dataSource}
					columns={columns}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
                    bordered={true}					
                    size="small"
                    rowSelection={{type:"checkbox",onChange:this.onSelectChange,}}
                    rowKey={(record) => `${record.id}`}
					 />
                <Modal title='添加联系人' visible={this.state.addVisible} destroyOnClose={true} centered width={800}
				onOk={this.handleAddOK} onCancel={this.handleAddCancel}
				okText='提交' cancelText='关闭'>
                    <ContoctsAdd ref={this.onAddRef} token = {this.state.token} handAddOKFinish={this.handAddOKFinish}  />
                </Modal>
                <Modal title='修改联系人' visible={this.state.editVisible} destroyOnClose={true} centered width={800}
				onOk={this.handleEditOK} onCancel={this.handleEditCancel}
				okText='提交' cancelText='关闭'>
                    <ContoctsEdit ref={this.onEditRef} contocts={this.state.contocts} handEditOKFinish ={this.handEditOKFinish} />
                </Modal>                
			</div >
        )
    }
    onAddRef = (ref) => {
        this.child = ref
    }

    onEditRef = (ref) => {
        this.child = ref
    }
    //点击创建按钮
	handleAdd = async () => {
		this.setState({
            addVisible: true,
            token:await ContoctsService.getToken()
		})
    }

    handleAddOK = () =>{
        this.child.handleOK();
    }

    handAddOKFinish = ()=>{
        this.setState({ addVisible: false })        
        this.search(); 
    }
    
    //取消添加
	handleAddCancel = () => {
		this.setState({ addVisible: false })
	}

    onSelectChange = (record, selected) => {
        var selectedRowKeys =  new Array()
        selected.forEach(row => {
            if(row !== undefined){
                selectedRowKeys.push(row.id)
            }            
        });
        this.setState({ selectedRowKeys: selectedRowKeys});
    };

    handleEdit = async () => {
        if(this.state.selectedRowKeys.length > 1){
            message.error("对不起，您只能选择一行进行修改！");
            return;
        }
        if(this.state.selectedRowKeys.length < 1){
            message.info("您好，您必须选择一行进行修改！"); 
            return
        }
        //获取数据
        this.setState({ 
            editVisible: true, 
            contocts:await ContoctsService.getContocts(this.state.selectedRowKeys[0])
        })
    }

    handleEditOK = () =>{       
        this.child.handleOK();
    }

    handEditOKFinish = ()=>{
        this.setState({ editVisible: false })        
        this.search(); 
    }

    handleEditCancel = () => {
		this.setState({ editVisible: false })
    }
    
    //点击删除按钮
	handleDelete = (id) => {
        const selectedRowKeys = this.state.selectedRowKeys;
        if(selectedRowKeys.length < 1){
            message.info("您好，您必须选择一行进行删除！"); 
            return
        }
        
		const _this = this;
		confirm({
			title: '删除数据吗', content: '您确定要删除这'+selectedRowKeys.length+'项数据吗?', okText: '确定', okType: 'danger', cancelText: '取消',
			async onOk() {
                await ContoctsService.delete(selectedRowKeys)
                _this.setState({selectedRowKeys:[]});
				message.success("删除成功！")
				_this.search();
			},
		});
	}
}
export default Contocts;