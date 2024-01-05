> Update (05/01/2024): I am archiving this repo as it didn't get the expected utility among users. You can still clone it and customize it with another domain to get the purpose done.

# ish.ninja
`ish.ninja` is a free online platform to allocate a unique `ish.ninja` sub handle name for a BlueSky account.

It is built using Next.js, Xata, The AT Protocol & Vercel API.

It serves as a solid example of how to serve sub-domain as handle names for BlueSky accounts. This is beneficial for verification purpose for users in an organization, community, or a project that have a single parent domain and want to have sub-domains for each user.

This project uses the `ish.ninja` domain to allocate sub handle names for BlueSky accounts. 


### How it works?

1. User visits `ish.ninja` and authenticates with their BlueSky account.
2. If user is already using a `ish.ninja` subhandle, then they can see their sub handle name and update it if they want.
3. If user is not using `ish.ninja` then they can allocate a sub handle name for their BlueSky account, given that the sub handle name is not already taken.

You can clone it and deploy it on your own domain to allocate sub handle names for your own domain.

#### Things to keep in mind when deploying this project on your own domain:
- Create a new xata database using the [xata-cli](https://xata.io/docs/getting-started/cli#branches) or from the [xata dashboard](https://app.xata.io/workspaces). Create a new table named `usernames`, with three columns id (default), username(string), and did(string). 
- For saving all the information related to the domain, I've used Vercel, as the Vercel API endpoints to play with the DNS records are easy to implement. Check the docs [here](https://vercel.com/docs/rest-api/endpoints#dns)
- The documentation for AT Protocol can be found [here](https://atproto.com/docs/). 

### How your data is treated?

We require your BlueSky credentials to authenticate you directly with the BlueSky server. We do not store your BlueSky credential on our database.

 All the tokens, profile data, your preferences are stored in your browser's storage and will never leave your browser without your consent.

Once you allocate a sub handle name, we store it in the database along with your DID, just to uniquely identify you and your sub handle name. 

If you do not wish to share your DID with us, please do not use this service as saving your sub handle and DNS propogation requires your DID to be shared with us.

We do not store any other data related to your BlueSky account.

Once you update your sub handle name, we update the database with your new sub handle name. 

If you change your BlueSky handle directly from the BlueSky app, your sub handle will be deleted from our database within 24 hours. Once deleted, the sub handle name will be available for allocation again.

### Warning/Disclaimer/Note/Whatever

The AT Protocol is still in development and a lot of things can break. If you find any bug or have any suggestion, please open an [issue](https://github.com/bluesky-social/atproto). 

If you have any security concern, please email me at `ninja@ishaanbedi.in` or DM me on [Twitter](https://twitter.com/ishnbedi).

### License

MIT License. See the [LICENSE](LICENSE) file for more information.
