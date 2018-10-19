export const sample = {
  "type": "relationship",
  "dag": {
    "ingress-uid": [
      {
        "node": "service-uid",
        "edge": "explicit"
      },
    ],
    "ingress2-uid": [
      {
        "node": "service-uid",
        "edge": "explicit"
      },
    ],
    "service-uid": [
      {
        "node": "deployment-uid",
        "edge": "implicit"
      },
    ],
    "deployment-uid": [
      {
        "node": "replicaset-uid",
        "edge": "explicit"
      },
    ],
    "replicaset-uid": [
      {
        "node": "pod",
        "edge": "explicit"
      },
    ]
  },
  "objects": {
    "ingress-uid": {
      "name": "ingress",
      "status": "ok",
      "message": ""
    },
    "ingress2-uid": {
      "name": "ingress2",
      "status": "ok",
      "message": ""
    },
    "service-uid": {
      "name": "service",
      "status": "ok",
      "message": ""
    },
    "deployment-uid": {
      "name": "deployment",
      "status": "ok",
      "message": ""
    },
    "replicaset-uid": {
      "name": "deployment-deployment-12345",
      "status": "ok",
      "message": ""
    },
    "pod": {
      "name": "deployment-deployment pods",
      "status": "ok",
      "message": ""
    },
  }
}