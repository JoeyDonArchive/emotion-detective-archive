/* eslint-disable */
// this is an auto generated file. This will be overwritten
export default {
  createVideo: `mutation createVideo($createVideo: CreateVideo!) {
    createVideo(input: $createVideo) {
      id
      name
      isVideoReady
      created_at
    }
  }`,
  createJob: `mutation createJob($createJob: CreateJobInput!) {
    createJob(input: $createJob) {
      rekJobId
      waitToken
    }
  }`,
  updateVideo: `mutation updateVideo($updateVideo: UpdateVideo!) {
    updateVideo(input: $updateVideo) {
      id
      name
      project_id
      project_name
      isVideoReady
      updated_at
      created_at
      annotations{
        data
        start
        end
      }
    }
  }`,
  deleteJob: `mutation deleteJob($deleteJob: DeleteJobInput!) {
    deleteJob(input: $deleteJob) {
      rekJobId
    }
  }`,
  createJob: `mutation createJob($createJob: CreateJob!) {
    createJob(input: $createJob) {
      id
      start_at
    }
  }`,
  createClient: `mutation createClient($createClient: CreateClient!) {
    createClient(input: $createClient) {
      id
      name
    }
  }`,
  deleteClient: `mutation deleteClient($deleteClient: DeleteClient!) {
    deleteClient(input: $deleteClient) {
      id
    }
  }`,
  createProject: `mutation createProject($createProject: CreateProject!) {
    createProject(input: $createProject) {
      id
      name
      client_id
    }
  }`,
};
