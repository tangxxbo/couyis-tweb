import React, { Component } from 'react';
import { Table, Button, Input, message, Modal } from 'antd';
import { PlusOutlined,EditOutlined,LogoutOutlined,SearchOutlined,KeyOutlined} from '@ant-design/icons';
import Authority from '../../../Frame/Authority';
import StaffService from './Service'
import StaffAdd from './Add'
import StaffEdit from './Edit'
import RestPassword from './RestPassword'
const {confirm} = Modal
class Staff extends Component {
    state = {
        dataSource: [],
        pagination:{},
        filters:{},
        sorter:{},
        loading:false,
        addVisible: false,
        editVisible:false,
        restVisible:false,
        selectedRowKeys:[],
        staff:{},
        positions:[]
    }

    componentDidMount = () => {
		this.search();
    }
    
    search = (pagination=this.state.pagination, filters=this.state.filters, sorter=this.state.sorter) => {
        this.setState({ loading: true })
        StaffService.pageList({...pagination, ...filters, ...sorter}).then(res => {
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
        const columns = [   { title: '序号', width: 80, render: (text, record, index) => `${index + 1}`, },
                            { title: '工号', width: 240, dataIndex: 'code', key: 'code', sorter: true, ...this.getSearchProps("code")},
                            { title: '姓名', width: 140, dataIndex: 'name', key: 'name', sorter: true,...this.getSearchProps("name") },
                            { title: '状态', width: 100, dataIndex: 'status', key: 'status', sorter: true, 
                            filters: [
                                { text: '正常', value: 'NORMAL' },
                                { text: '离职', value: 'QUIT' },
                              ],
                            render: ((data) => {
                                    switch (data) {
                                        case 'NORMAL':
                                            return '正常'
                                        case 'QUIT':
                                            return '离职'
                                        default:
                                            return "";
                                    }
                                })
                            },
                            { title: '帐号', width: 150, dataIndex: 'acc', key: 'acc', },
                            { title: '部门', width: 150, dataIndex: 'orgName', key: 'orgName',...this.getSearchProps("orgName") },
                            { title: '职务', width: 150, dataIndex: 'positionName', key: 'positionName', ...this.getSearchProps("positionName")},
                            { title: '创建人', dataIndex: 'createUser', key: 'createUser', width: 100, },
                            { title: '创建时间', dataIndex: 'createTime', key: 'createTime', sorter: true, width: 200, },
                            { title: '修改人', dataIndex: 'updateUser', key: 'updateUser', width: 100, },
                            { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', sorter: true, width: 200, }   
            ];
        return(
            <div className="table-list"> 
               <div className='table-list-top'>
                    <div className='table-list-top-tp'>
                            <Authority authorityId='STAFF_EDIT'>
                                    <Button className="table-list-operator-buttom" type="primary" icon={<PlusOutlined />} onClick={this.handleAdd}>新建</Button>
                                    <Button className="table-list-operator-buttom" type="primary" icon={<EditOutlined />} onClick={this.handleEdit}>修改</Button>
                            </Authority>
                            <Authority authorityId='STAFF_DIMISSION'>
                                <Button className="table-list-operator-buttom" type="primary" icon={<LogoutOutlined  />} onClick={this.handleDimission}>离职</Button>
                            </Authority>
                            <Authority authorityId='STAFF_CHANGE_PASSWORD'>
                                <Button className="table-list-operator-buttom" type="primary" icon={<KeyOutlined  />} onClick={this.handleChangePassword}>重置密码</Button>
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
                <Modal title='添加用户' visible={this.state.addVisible} destroyOnClose={true} centered width={800}
				onOk={this.handleAddOK} onCancel={this.handleAddCancel} okText='提交' cancelText='关闭'>
                    <StaffAdd ref={this.onAddRef} token = {this.state.token} handAddOKFinish={this.handAddOKFinish}/>
                </Modal>
                <Modal title='修改用户' visible={this.state.editVisible} destroyOnClose={true} centered width={800}
				onOk={this.handleEditOK} onCancel={this.handleEditCancel}
				okText='提交' cancelText='关闭'>
                    <StaffEdit ref={this.onEditRef} staff={this.state.staff} handEditOKFinish ={this.handEditOKFinish} />
                </Modal>
                <Modal title='重置密码' visible={this.state.restVisible} destroyOnClose={true} centered width={800}
				onOk={this.handleRestOK} onCancel={this.handleRestCancel}
				okText='提交' cancelText='关闭'>
                    <RestPassword ref={this.onRestRef} staff={this.state.staff} handleRestOKFinish ={this.handleRestOKFinish}/>
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

    onRestRef = (ref) => {
        this.child = ref
    }
    //点击创建按钮
	handleAdd = async () => {
		this.setState({
            addVisible: true,
            token:(await StaffService.getToken()),
		})
    }

    
    handleAddOK = (values) =>{
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
            staff:await StaffService.getStaff(this.state.selectedRowKeys[0]),
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

    handleChangePassword = async () => {
        if(this.state.selectedRowKeys.length > 1){
            message.error("对不起，您只能选择一行进行操作！");
            return;
        }
        if(this.state.selectedRowKeys.length < 1){
            message.info("您好，您必须选择一行进行操作！"); 
            return
        }
        //获取数据
        this.setState({ 
            restVisible: true, 
            staff:await StaffService.getStaff(this.state.selectedRowKeys[0]),
        })
    }

    handleRestOK = () =>{       
        this.child.handleOK();
    }

    handleRestOKFinish = ()=>{
        this.setState({ restVisible: false })        
    }

    handleRestCancel = () => {
		this.setState({ restVisible: false })
    }

    //点击删除按钮
	handleDimission = (id) => {
        const selectedRowKeys = this.state.selectedRowKeys;
        if(selectedRowKeys.length < 1){
            message.info("您好，您必须选择一行进行操作！"); 
            return
        }        
		const _this = this;
		confirm({
			title: '该人员已经离职了吗', content: '您确定这'+selectedRowKeys.length+'个人员已经离职了吗?', okText: '确定', okType: 'danger', cancelText: '取消',
			async onOk() {
                await StaffService.dimission(selectedRowKeys)
                _this.setState({selectedRowKeys:[]});
				message.success("操作成功！")
				_this.search();
			},
		});
	}
}
export default Staff;