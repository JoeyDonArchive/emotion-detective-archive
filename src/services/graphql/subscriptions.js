/* eslint-disable */
// this is an auto generated file. This will be overwritten
module.exports = {
  NewVideoSub: `subscription NewVideoSub {
    createdVideo {
      id
      name
      isVideoReady
      created_at
    }
  }`,
  UpdateVideoSub: `subscription UpdateVideoSub {
    updatedVideo {
      id
      name
      project_id
      project_name
      isVideoReady
      created_at
    }
  }`,
  NewClientSub: `subscription NewClientSub {
    createdClient {
      id
      name
    }
  }`,
  DeleteClientSub: `subscription DeleteClientSub {
    deletedClient {
      id
    }
  }`,
  NewProjectSub: `subscription NewProjectSub {
    createdProject {
      id
      client_id
      name
    }
  }`,
};
