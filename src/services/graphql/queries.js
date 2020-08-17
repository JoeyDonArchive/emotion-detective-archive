/* eslint-disable */
// this is an auto generated file. This will be overwritten
module.exports = {
    getOneVideo: `query getOneVideo($videoName: String!) {
    getOneVideo(videoName: $videoName) {
      id
      name
    }
  }`,
    getOneVideoById: `query getOneVideoById($id: ID!) {
    getOneVideoById(id: $id) {
      id
      name
      project_id
      created_at
      annotations {
        data
        start
        end
      }
    }
  }
  `,
    getMyJob: `query getMyJob($rekJobId: String!) {
    getMyJob(rekJobId: $rekJobId) {
      rekJobId
      waitToken
    }
  }`,
    listVideos: `query listVideos($limit: Int!) {
    listVideos(limit: $limit) {
      items{
        id
        name
        project_id
        project_name
        isVideoReady
        created_at
      }
    }
  }`,
    listVideosByProjectId: `query listVideosByProjectId($id: ID!) {
    listVideosByProjectId(id: $id) {
      items{
        id
        name
        project_name
      }
    }
  }`,
    listClients: `query listClients($limit: Int!) {
    listClients(limit: $limit) {
      items{
        id
        name
        projects{
          id
          name
        }
      }
    }
}`,
    listProjects: `query listProjects($limit: Int!) {
    listProjects(limit: $limit) {
      items{
        id
        name
        client_id
      }
  }
}`
};
