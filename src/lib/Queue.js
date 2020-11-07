import Queue from 'bull';
import * as jobs from '../app/jobs/Index';

const options = { redis: { port: 6379, host: 'redis', password: '' } };

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, options),
  name: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find((q) => q.name === name);
    return queue.bull.add(data);
  },
  process() {
    return this.queues.forEach((q) => {
      q.bull.process(q.handle);
      q.bull.on('failed', (job, err) => {
        console.log('Job failed', q.key, job.data);
        console.log(err);
      });
    });
  },
};
