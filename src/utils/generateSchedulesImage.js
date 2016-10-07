import phantom from 'phantom';
import { port, scheduleListSnapshotTimeout } from '../../config';

let timer = null;

export default () => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    let sitepage = null;
    let phInstance = null;
    phantom.create()
      .then(instance => {
        phInstance = instance;
        return instance.createPage();
      })
      .then(page => {
        sitepage = page;
        return page.open(`http://localhost:${port}/headless`);
      })
      .then(() => {
        return sitepage.render('./public/images/schedules.png', { format: 'png' });
      })
      .then(() => {
        sitepage.close();
        phInstance.exit();
      })
      .catch(error => {
        console.log(error);
        phInstance.exit();
      });
  }, scheduleListSnapshotTimeout);
};
