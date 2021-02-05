import { ServerApplication } from './application';
import { Constants } from './utilities/constants';

export async function main(config: { rest: { port: number } }) {
  try {
    global.env = process.env.NODE_ENV ?? Constants.ENV_LOCAL;
    const app = new ServerApplication(config);

    await app.init();
    app.listen();

    return app;
  } catch (error) {
    console.error(`Error occured while fetching config : ${error.message}`);
  }
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      gracePeriodForClose: 5000, // 5 seconds
    },
  };

  main(config)
    .then(() => {
      console.log(`Server is running at port ${config.rest.port}`);
    })
    .catch(err => {
      console.error('Cannot start the application [err]: ', err);
      process.exit(1);
    });
}
