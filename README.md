# Issue with imports from library "@react-email/components" when using "import-in-the-middle"

This repo contains a basic example of the failure to correctly read the re-exports from the @react-email/components library when using `node --experimental-loader=import-in-the-middle/hook.mjs` to load the compiled server code.

## How to use

### Using a compiled server

1. `yarn install`
2. `yarn build`
3. `yarn start` - built server will run
4. Go to <http://localhost:3000> and you should see the output "Hello world!"

### Using a compiled server with import-in-the-middle

1. `yarn install`
2. `yarn build`
3. `yarn start:import`

Server will fail to run, generating an error message that indicates that instead of treating the exports as coming from a different node_modules library, it is looking for them as sibling directories of the @react-email/components index.js file:

```sh
node:internal/process/esm_loader:40
      internalBinding('errors').triggerUncaughtException(
                                ^
[Error: ENOENT: no such file or directory, open '/home/username/project/node_modules/.store/@react-email-components-virtual-daf4c187d9/package/dist/@react-email/body'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/home/username/project/node_modules/.store/@react-email-components-virtual-daf4c187d9/package/dist/@react-email/body'
}
```
