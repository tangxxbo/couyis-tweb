import request from '../../../../Axios/request'
import service from '../../../../Axios/service'
import '../../../../Config/config'
const basePath = global.constants.tbase;
class CodeRangeDisService extends service {
	pageList = (data) => {
		return new Promise((resolve, reject) => {
			request.axiosRequest({ url: basePath +'/base/coderangedis/list', method: 'post', data: data }).then(res => {
				resolve(res);
			}).catch(error => {
				reject(error);
			})
		})
	}

	// getTreeDict = async () => {
	// 	let result = await request.axiosSynRequest({ url: basePath + '/base/coderange/findAll', method: 'post' });
	// 	return this.assembleTree(result);
	// }

	add = async (data) => {
		let result = await request.axiosSynRequest({ url: basePath +'/base/coderangedis/add?token=' + data.token, method: 'post', data: data });
		return result;
	}

	// getCode = async (data) => {
	// 	let result = await request.axiosSynRequest({ url:  basePath +'/base/coderange/checkCode?code='+ data, method: 'post'});
	// 	// console.log(result);
	// 	return result;
	// }

	// getCodeRange = async (id) => {
	// 	let result = await request.axiosSynRequest({ url:  basePath +'/base/coderange/edit/' + id, method: 'get' });
	// 	return result;
	// }

	// edit = async (data) => {
	// 	let result = await request.axiosSynRequest({ url: basePath +'/base/coderange/edit', method: 'post', data: data });
	// 	return result;
	// }

    delete = async (data) => {
		let result = await request.axiosSynRequest({ url: basePath + '/base/coderangedis/delete', method: 'post' ,data: data});
		return result;
	}

	// getDictByParentCode = async (code) =>{
	// 	let result = await request.axiosSynRequest({ url: basePath + '/base/dict/findByParentCode/'+code, method: 'post'});
	// 	return result;
	// }
}

export default new CodeRangeDisService()
