import React, { Component } from 'react';
import moment from 'moment';
import { message, Form, Input,Select,DatePicker  } from 'antd';
import FinishedProductService from '../Service'
import DictService from '../../../../Base/Dict/Service'
const { TextArea } = Input;
const { Option } = Select;
//添加组件
class Edit extends Component {
    formRef = React.createRef();   
    
	handleOK = () => {
        this.formRef.current.submit();
	};
	
	state ={selectModelNumbers:'',selectModelCategorys:'',selectModelDepts:''}
	componentWillMount =async ()=>{
		const modelNumber= await DictService.getDictByParentCode("MODEL_NUMBER")
		const modelCategory= await DictService.getDictByParentCode("MODEL_CATEGORY")
		const modelDept= await DictService.getDictByParentCode("MODEL_DEPT")
		this.setState({
			selectModelNumbers:modelNumber.map(d => (<Option key={d.name}>{d.name}</Option>)),
			selectModelCategorys:modelCategory.map(d => (<Option key={d.name}>{d.name}</Option>)),
			selectModelDepts:modelDept.map(d => (<Option key={d.name}>{d.name}</Option>)),
		})
		
	}
    
    onFinish =  async (values) =>{
        const { handEditOKFinish } = this.props;
        await FinishedProductService.edit(values);
        message.success("修改成功！");
        handEditOKFinish();
    }

	render() {       
		const { finishedProduct } = this.props;
		finishedProduct.putTime = moment(finishedProduct.putTime,'YYYY-MM-DD')
		finishedProduct.chargeTime = moment(finishedProduct.chargeTime,'YYYY-MM-DD')
		const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 5 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 15 }, } };
		return (
			
				<Form {...formItemLayout}  ref={this.formRef}  onFinish={this.onFinish} initialValues={{...finishedProduct}}>
                    <Form.Item name="id" style={{display:'none'}} rules={[{ required: true, message: 'id!' }]}>
                        <Input type='hidden'/>
					</Form.Item>
					<Form.Item label="机器型号" name="modelNumber" rules={[{ required: true, message: '机器型号不能为空!' }]}>
                        <Select  showSearch filterOption={(input, option) =>
												option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}>
							{this.state.selectModelNumbers}
						</Select>
					</Form.Item>
					<Form.Item label="机器编码" name="code" rules={[{ required: true, message: '机器编码不能为空!' }]}>
                        <Input />
					</Form.Item>
					<Form.Item label="类型" name="name" rules={[{ required: true, message: '机器编码不能为空!' }]}>
						<Select  showSearch filterOption={(input, option) =>
												option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}>
							{this.state.selectModelCategorys}
						</Select>
					</Form.Item>
					<Form.Item label="归属部门" name="dept" rules={[{ required: true, message: '归属部门不能为空!' }]}>
						<Select  showSearch filterOption={(input, option) =>
												option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}>
							{this.state.selectModelDepts}
						</Select>
					</Form.Item>
					<Form.Item label="入库时间" name="putTime" rules={[{ required: true, message: '入库时间不能为空!' }]}>
                        <DatePicker  />
					</Form.Item>
					<Form.Item label="充电时间" name="chargeTime" rules={[{ required: true, message: '充电时间不能为空!' }]}>
                        <DatePicker  />
					</Form.Item>
					<Form.Item label="库位" name="location" rules={[{ required: true, message: '库位不能为空!' }]}>
                        <Input />
					</Form.Item>
					<Form.Item label="备注" name="description">
						<TextArea rows={3} />
					</Form.Item>
				</Form>
		);
	}
}
export default Edit;