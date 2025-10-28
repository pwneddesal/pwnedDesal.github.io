---
title: Reconnaissance Guide for Mendix Applications 
date: 2025-10-28 00:00:00 +02:00
categories:
- Info Leakage
- recon
layout: post
excerpt: Mendix is a low-code application development platform that enables rapid application development. However, like any web application framework, it comes with its own set of security considerations. This guide explores various penetration testing techniques specific to Mendix applications, focusing on client-side exploitation and metadata enumeration.
comments: true
thumbnail: japan.jpg
---



# Reconnaissance Guide for Mendix Applications 


## Introduction

Mendix is a low-code application development platform that enables rapid application development. However, like any web application framework, it comes with its own set of security considerations. This guide explores various penetration testing techniques specific to Mendix applications, focusing on client-side exploitation and metadata enumeration.

## Mendix XML Template Files

These files serve as templates for various forms within Mendix applications, including login pages and file upload interfaces. They contain valuable reconnaissance information such as form fields and occasionally user role definitions. Notably, these XML files are publicly accessible, making them excellent targets for dictionary-based enumeration attacks to discover commonly named forms. You can access them at: `http://localhost:8080/pages/
	
![](/img/Pastedimage20251028165800.png)
![](/img/Pastedimage20251028165747.png)
	
 ## mx javscript library
```
// View session metadata. Entity
mx.session.sessionData.metadata 
// Check available microflows
mx.session.sessionData.microflows 
// Examine object types 
mx.session.sessionData.metadata[2]['objectType']
//Enumeation
mx.session.sessionData.enumerations
```


![](/img/Pastedimage20251028172328.png)
![](/img/Pastedimage20251028172958.png)

**In certain cases, guest or anonymous users may gain access to the `System.user` entity, which holds sensitive credentials such as usernames and passwords.**


 ## get_session action
  you can also send an HTTP post request with `get_session_data` action
to get valuable information about the mendix app such as constants, data type, and fields. Fields and Data type are useful for other vulnerability such SQL injection   ![[Pasted image 20251028163226.png]]**Sample http response**
![](/img/Pastedimage20251028163607.png)
![](/img/Pastedimage20251028163641.png])

## widget

- You can list all widgets on the https://app/widgets/.*
  ![](/img/Pastedimage20251028162615.png])

  Sometimes these widgets contains js library that is vulnerable to CVEs
   ![](/img/Pastedimage20251028162826.png])
