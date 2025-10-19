# VoteSmart API: Expanded Schemas

This document provides a comprehensive and fully expanded view of all data schemas available in the VoteSmart API. A total of **86** schemas have been extracted and are detailed below.

---

## AddressCandidate

No description available.

### Properties

#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## AddressCandidateOffice

No description available.

### Properties

#### `address`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `type`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `typeId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `street`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `city`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `state`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `zip`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `candidate`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `title`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `firstName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `middleName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `nickName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `lastName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `suffix`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `notes`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `contactName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `contactTitle`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `note`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `phone`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `phone1`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `phone2`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `fax1`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `fax2`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `tollFree`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `ttyd`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `cellphone`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## AddressOffice

No description available.

### Properties

#### `address`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `type`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `typeId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `street`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `city`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `state`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `zip`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `notes`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `contactName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `contactTitle`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `note`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `phone`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `phone1`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `phone2`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `fax1`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `fax2`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `tollFree`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `ttyd`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `cellphone`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## AddressWeb

No description available.

### Properties

#### `webAddress`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `webAddressType`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `webAddressTypeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## Bill

No description available.

### Properties

#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `type`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## BillOffice

No description available.

### Properties

#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `office`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `type`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## BillOfficialCategory

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## BillsByOfficial

No description available.

### Properties

#### `actionId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `categories`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `office`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `stage`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `statusDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `vote`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Bio

No description available.

### Properties

#### `candidate`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `crpId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `photo`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `firstName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `nickName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `middleName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `preferredName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `lastName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `suffix`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `birthDate`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `birthPlace`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `pronunciation`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `gender`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Allowed values**: `Female`, `Male`
  
  #### `family`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `homeCity`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `homeState`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `religion`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `specialMsg`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `elections`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `stateId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `officeTypeId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `special`
  
  - **Type**: `boolean`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `electionYear`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `offices`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `levelId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `branchId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `typeId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `title`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `shortTitle`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## Candidate

No description available.

### Properties

#### `birthDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `birthPlace`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `crpId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `family`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `gender`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
- **Allowed values**: `Female`, `Male`
#### `homeCity`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `homeState`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `photo`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `preferredName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `pronunciation`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `religion`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `specialMsg`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CandidateAdditional

No description available.

### Properties

#### `data`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CandidateDetail

No description available.

### Properties

#### `candidate`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `crpId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `photo`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `firstName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `nickName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `middleName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `preferredName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `lastName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `suffix`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `birthDate`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `birthPlace`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `pronunciation`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `gender`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Allowed values**: `Female`, `Male`
  
  #### `family`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `homeCity`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `homeState`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `religion`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `specialMsg`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `education`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Properties**:
    #### `institutions`
    
    - **Type**: `array`
    - **Required**: Yes
    - **Description**: No description provided.
    - **Items** (`object`):
      #### `degree`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `field`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `school`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `span`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `gpa`
      
      - **Type**: `number`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `fullText`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
    
  
  #### `profession`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Properties**:
    #### `experience`
    
    - **Type**: `array`
    - **Required**: Yes
    - **Description**: No description provided.
    - **Items** (`object`):
      #### `title`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `organization`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `span`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `special`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `district`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `fullText`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
    
  
  #### `political`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Properties**:
    #### `experience`
    
    - **Type**: `array`
    - **Required**: Yes
    - **Description**: No description provided.
    - **Items** (`object`):
      #### `title`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `organization`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `span`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `special`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `district`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `fullText`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
    
  
  #### `congMembership`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Properties**:
    #### `experience`
    
    - **Type**: `array`
    - **Required**: Yes
    - **Description**: No description provided.
    - **Items** (`object`):
      #### `title`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `organization`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `span`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `special`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `district`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `fullText`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
    
  
  #### `orgMembership`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Properties**:
    #### `experience`
    
    - **Type**: `array`
    - **Required**: Yes
    - **Description**: No description provided.
    - **Items** (`object`):
      #### `title`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `organization`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `span`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `special`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `district`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
      #### `fullText`
      
      - **Type**: `string`
      - **Required**: Yes
      - **Description**: No description provided.
      
    
  
#### `elections`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `stateId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `officeTypeId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `special`
  
  - **Type**: `boolean`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `electionYear`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `offices`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `levelId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `branchId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `typeId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `title`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `shortTitle`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## CandidateDetailBio

No description available.

### Properties

#### `birthDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `birthPlace`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `congMembership`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `experience`
  
  - **Type**: `array`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Items** (`object`):
    #### `title`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `organization`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `span`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `special`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `district`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `fullText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
  
#### `crpId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `education`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `institutions`
  
  - **Type**: `array`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Items** (`object`):
    #### `degree`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `field`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `school`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `span`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `gpa`
    
    - **Type**: `number`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `fullText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
  
#### `family`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `gender`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
- **Allowed values**: `Female`, `Male`
#### `homeCity`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `homeState`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `orgMembership`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `experience`
  
  - **Type**: `array`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Items** (`object`):
    #### `title`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `organization`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `span`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `special`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `district`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `fullText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
  
#### `photo`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `political`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `experience`
  
  - **Type**: `array`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Items** (`object`):
    #### `title`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `organization`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `span`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `special`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `district`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `fullText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
  
#### `preferredName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `profession`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `experience`
  
  - **Type**: `array`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Items** (`object`):
    #### `title`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `organization`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `span`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `special`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `district`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `fullText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
  
#### `pronunciation`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `religion`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `specialMsg`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CandidateOfficeCommittee

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CandidateRating

No description available.

### Properties

#### `optionText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rank`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `rating`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `ratingId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `ratingText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `sigId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `timeSpan`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CandidateResponse

No description available.

### Properties

#### `ballotName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionDistrictId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionDistrictName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionOffice`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionOfficeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `electionOfficeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionSpecial`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `electionStage`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionStateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionStatus`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionYear`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeStateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeStatus`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `preferredName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rank`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `runningMateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `runningMateName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Committee

No description available.

### Properties

#### `committeeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `contact`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `address1`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `address2`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `city`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `state`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `zip`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `phone`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `fax`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `email`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `url`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `staffContact`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `jurisdiction`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `parentId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CommitteeContact

No description available.

### Properties

#### `address1`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `address2`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `city`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `email`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `fax`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `phone`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `staffContact`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `state`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `url`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `zip`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CommitteeMember

No description available.

### Properties

#### `candidateId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `party`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `position`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CommitteeSponsor

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CommitteeTypeIdName

No description available.

### Properties

#### `id`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## CommitteeTypeState

No description available.

### Properties

#### `committeeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `parentId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## District

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Education

No description available.

### Properties

#### `institutions`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `degree`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `field`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `school`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `span`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `gpa`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `fullText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## Election

No description available.

### Properties

#### `electionYear`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `special`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## ElectionCandidate

No description available.

### Properties

#### `district`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionElectionstageId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `party`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `runningMateId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `runningMateName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `status`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `voteCount`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `votePercent`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## ElectionStage

No description available.

### Properties

#### `electionDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionElectionstageId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `filingDeadline`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `npatMailed`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `stageId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## ElectionWithStages

No description available.

### Properties

#### `electionYear`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `special`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `stages`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `stageId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `electionElectionstageId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `stateId`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `electionDate`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `filingDeadline`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `npatMailed`
  
  - **Type**: `boolean`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Experience

No description available.

### Properties

#### `experience`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `title`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `organization`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `span`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `special`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `district`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `fullText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## ExperienceProp

No description available.

### Properties

#### `district`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `fullText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `organization`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `span`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `special`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Institution

No description available.

### Properties

#### `degree`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `field`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `fullText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `gpa`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `school`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `span`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## LeadershipOfficial

No description available.

### Properties

#### `candidateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `position`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## LeadershipPosition

No description available.

### Properties

#### `id`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Local

No description available.

### Properties

#### `id`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `url`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## LocalOfficial

No description available.

### Properties

#### `candidateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionDistrictId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionStateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeStateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Measure

No description available.

### Properties

#### `code`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `conUrl`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionType`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `measureText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `no`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `outcome`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
- **Allowed values**: `Failed`, `Passed`
#### `proUrl`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `source`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `summary`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `summaryUrl`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `textUrl`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `url`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `yes`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## MeasurePartial

No description available.

### Properties

#### `code`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `outcome`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
- **Allowed values**: `Failed`, `Passed`
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## NpatCandidate

No description available.

### Properties

#### `candidate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionStage`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `electionYear`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `npatName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `passed`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `sections`

- **Type**: `array`
- **Description**: No description provided.
- **Items** (`object`):
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `row`
  
  - **Type**: `array`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Items** (`object`):
    #### `path`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `rowText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `rowType`
    
    - **Type**: `number`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `open`
    
    - **Type**: `boolean`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `optionText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
    #### `answerText`
    
    - **Type**: `string`
    - **Required**: Yes
    - **Description**: No description provided.
    
  
#### `surveyMessage`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Office

No description available.

### Properties

#### `branchId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
#### `levelId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `shortTitle`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `typeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## OfficeAddress

No description available.

### Properties

#### `city`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `state`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `street`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `type`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `typeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `zip`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## OfficeBranch

No description available.

### Properties

#### `id`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## OfficeLevel

No description available.

### Properties

#### `id`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## OfficeNote

No description available.

### Properties

#### `contactName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `contactTitle`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `note`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## OfficePhone

No description available.

### Properties

#### `cellphone`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `fax1`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `fax2`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `phone1`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `phone2`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `tollFree`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `ttyd`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## OfficeType

No description available.

### Properties

#### `branchId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
#### `levelId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Official

No description available.

### Properties

#### `electionParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `officeName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeStateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeStatus`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## OfficialByZip

No description available.

### Properties

#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `officeDistrictName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `officeName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeStateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeStatus`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## RatingCandidate

No description available.

### Properties

#### `categories`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `rating`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `ratingId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `ratingName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `ratingText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `timespan`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## RatingCategory

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## RatingRating

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `rating`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## RatingSig

No description available.

### Properties

#### `address`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `city`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `contactName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `description`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `email`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `fax`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `parentId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `phone1`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `phone2`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `state`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `url`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `zip`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## Section

No description available.

### Properties

#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `row`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `path`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `rowText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `rowType`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `open`
  
  - **Type**: `boolean`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `optionText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `answerText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## SectionRow

No description available.

### Properties

#### `answerText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `open`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `optionText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `path`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rowText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rowType`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## Sig

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `parentId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## SigRating

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `ratingName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `ratingText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `timespan`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## State

No description available.

### Properties

#### `absenteeHow`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `absenteeWhen`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `absenteeWho`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `area`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `bicameral`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `billUrl`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `bird`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `capital`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `flower`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `generalDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `highPoint`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `largestCity`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `lowPoint`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `lowerLegis`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `ltGov`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `motto`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `population`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `primaryDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `reps`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `rollLower`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rollUpper`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `senators`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `stateType`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `id`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `statehood`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `termLength`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `termLimit`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `tree`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `upperLegis`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `usCircuit`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `voteUrl`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `voterReg`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## StateList

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## StateType

No description available.

### Properties

#### `id`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## User

No description available.

### Properties

#### `email`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `roles`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## UserCreate

No description available.

### Properties

#### `email`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `password`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `role`

- **Type**: `string`
- **Description**: No description provided.

---

## UserUpdate

No description available.

### Properties

#### `password`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `role`

- **Type**: `string`
- **Description**: No description provided.

---

## ValidationError

No description available.

### Properties

#### `errors`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
- **Example**: `Bad Request`
#### `message`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Example**: `['email must be longer than or equal to 3 characters', 'password must be longer than or equal to 8 characters']`
- **Items** (`string`):
#### `statusCode`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
- **Example**: `400`

---

## Vetoe

No description available.

### Properties

#### `billId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `billLink`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `billSummary`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `billTitle`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `statusDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `vetoCode`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `vetoLetterLink`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `vetoType`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizActiveState

No description available.

### Properties

#### `isReleased`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `officeTypeId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `releaseDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizBillActionVoteOfficial

No description available.

### Properties

#### `action`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `canidateId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `firstName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `lastName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `middleName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nickName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `party`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `suffix`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizCandidateEndorsement

No description available.

### Properties

#### `endorseId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `sigId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `sigName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizCandidateFinance

No description available.

### Properties

#### `cand_name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `cash_on_hand`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `chamber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `cid`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `cycle`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `debt`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `first_elected`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `last_updated`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `next_election`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `origin`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `party`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `source`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `spent`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `state`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `total`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizCandidateRating

No description available.

### Properties

#### `rating`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `sigId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `ratingId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `timeSpan`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `rating`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `ratingText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `rank`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `optionText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `rowId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## VizPct

No description available.

### Properties

#### `candidateId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `pct`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `row`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `rowId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `optionText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `outOptionText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  

---

## VizPctForm

No description available.

### Properties

#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `row`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `rowId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `subCategory`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `rowText`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `rowDetail`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `options`
  
  - **Type**: `object`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Properties**:
    #### `option`
    
    - **Type**: `array`
    - **Required**: Yes
    - **Description**: No description provided.
    - **Items** (`string`):
    
  

---

## VizPctFormRow

No description available.

### Properties

#### `options`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `option`
  
  - **Type**: `array`
  - **Required**: Yes
  - **Description**: No description provided.
  - **Items** (`string`):
  
#### `rowDetail`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rowId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `rowText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `subCategory`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizPctFormRowOption

No description available.

### Properties

#### `option`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`string`):

---

## VizPctRow

No description available.

### Properties

#### `optionText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `outOptionText`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rowId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## VizRatingAverageParty

No description available.

### Properties

#### `averageRating`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `partyName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizRatingPartyAverage

No description available.

### Properties

#### `party`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `partyName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `averageRating`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `sigId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `sigName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizReleaseDate

No description available.

### Properties

#### `releaseDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `released`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizVote

No description available.

### Properties

#### `billId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `nays`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `party`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `partyName`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `action`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `pctRow`

- **Type**: `object`
- **Required**: Yes
- **Description**: No description provided.
- **Properties**:
  #### `pctRowId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `yeas`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## VizVoteParty

No description available.

### Properties

#### `action`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `partyName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VizVotePctRow

No description available.

### Properties

#### `pctRowId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## Vote

No description available.

### Properties

#### `action`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `candidateName`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `officeParties`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VoteAction

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `level`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nay`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `outcome`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rollNumber`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `stage`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `statusDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `voiceVote`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `yea`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## VoteAmendment

No description available.

### Properties

#### `actionId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `statusDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VoteBill

No description available.

### Properties

#### `actions`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `level`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `stage`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `outcome`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `statusDate`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `rollNumber`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `yea`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `nay`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `voiceVote`
  
  - **Type**: `boolean`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `amendments`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `billNumber`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `actionId`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `title`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `statusDate`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `billtextLink`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `categories`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `committeeSponsors`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `dateIntroduced`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `officialTitle`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `parentBill`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `sponsors`

- **Type**: `array`
- **Required**: Yes
- **Description**: No description provided.
- **Items** (`object`):
  #### `id`
  
  - **Type**: `number`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `name`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
  #### `type`
  
  - **Type**: `string`
  - **Required**: Yes
  - **Description**: No description provided.
  
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `type`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VoteBillAction

No description available.

### Properties

#### `billId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `billNumber`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `category`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `categoryId`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `highlight`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `level`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `nay`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `note`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officialSynopsis`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `officialTitle`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `outcome`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `rollNumber`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `stage`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `stateId`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `statusDate`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `synopsis`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `title`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `type`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `voiceVote`

- **Type**: `boolean`
- **Required**: Yes
- **Description**: No description provided.
#### `yea`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.

---

## VoteCategory

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

## VoteSponsor

No description available.

### Properties

#### `id`

- **Type**: `number`
- **Required**: Yes
- **Description**: No description provided.
#### `name`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.
#### `type`

- **Type**: `string`
- **Required**: Yes
- **Description**: No description provided.

---

