import {logger} from 'ft-next-logger';
import raven from 'express-errors-handler';

export default class SpoorApi {

	constructor ({source='next-signup', category='signup', apiKey=process.env.SPOOR_API_KEY, req}={}) {
		this.source = source;
		this.category = category;
		this.req = req;
	}

	submit ({source=this.source, category=this.category, req=this.req, apiKey=this.apiKey, action, context}={}) {

		context.product = 'next';

		const the = {
			status: undefined,
			summary: {
				source,
				category,
				action,
				context
			},
			data: {
				system: {
					api_key: apiKey,
					version: '1.0.0',
					source: source
				},
				context: context,
				category: category,
				action: action
			}
		};

		logger.info('spoor -> about to send event ->', JSON.stringify(the.data));
		logger.info('spoor -> about to send event ->', the.summary);

		return fetch('https://spoor-api.ft.com/ingest', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Cookie': req.get('cookie'),
				'User-Agent': req.get('user-agent'),
				'Content-Length': new Buffer(JSON.stringify(the.data)).length,
				'spoor-ticket': '16e5045d-7797-5990-bdaf-4a767a655aeb'
			},
			body: JSON.stringify(the.data)
		})
		.then(response => {
			logger.info('spoor -> response status ->', response.status);
			the.status = response.status;
			return response.json();
		})
		.then(payload => {
			const info = {
				payload,
				status: the.status,
				request: the.summary
			};

			logger.info('spoor -> response ->', info);

			if(the.status !== 202) {
				return Promise.reject(info);
			}
		})
		.catch(err => {
			logger.error(`spoor -> api error (${action}) -> `, err);
			raven.captureError(err);
		});
	}
}