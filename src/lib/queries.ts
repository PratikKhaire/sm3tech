'use server'
import { useUser } from '@clerk/nextjs'
import { connectDB, db } from './db'
import { User, IUser } from '@/models/user.model'
import { currentUser } from '@clerk/nextjs/server'
import { Agency, IAgency } from '@/models/agency.model'
import { get } from 'http'
import { QueryCache } from 'react-query'
import { UTApi } from 'uploadthing/server'
import { utapi } from '@/server/uploadthing'
import { promises } from 'dns'
import { IFactoryLicenseDetails } from '@/models/factoryLicenseDetails.model'
// Write a query to save the current user's profile from Clerk provider in MongoDB
export const initUser = async (newUser: Partial<IUser>) => {
  const user = await currentUser()
  if (!user) return

  // Find and update or create the user
  try {
    await connectDB()
    const userData = await User.updateOne(
      { email: user.emailAddresses[0].emailAddress }, // Query condition
      {
        ...newUser,
        id: user.id,
        avatar: user.imageUrl,
        name: `${user.firstName} ${user.lastName}`,
      }, // Update data
      { upsert: true } // Create the document if it doesn't exist
    )
    return userData
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Error updating user')
  }
}

let userData: any

export const getUser = async () => {
  if (userData) return userData

  try {
    const user = await currentUser()
    if (!user) return
    await connectDB()
    let userData = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    })
      .lean()
      .exec()
    // const plainUser = JSON.parse(JSON.stringify(userData))
    // userData = plainUser
    return userData
  } catch (error) {
    console.error('Error getting user:', error)
    throw new Error('Error getting user')
  }
}
export const upsertAgency = async (agencyData: Partial<IAgency>) => {
  try {
    console.log('=== UPSERT AGENCY STARTED ===')
    console.log('Agency data received:', agencyData)

    // CRITICAL: Connect to database first
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected')

    console.log('Searching for existing agency with _id:', agencyData._id)
    let agency = await Agency.findOne({ _id: agencyData._id })
    console.log('Existing agency found:', !!agency)

    if (agency) {
      console.log('Updating existing agency...')
      agency = await Agency.findByIdAndUpdate(
        agency._id,
        {
          $set: {
            ...agencyData,
            occupierDocuments: {
              name: agencyData.occupierDocuments?.name,
              photo: agencyData.occupierDocuments?.photo,
              signature: agencyData.occupierDocuments?.signature,
            },
            applicantIdProof: {
              electionId: agencyData.applicantIdProof?.electionId,
              drivingLicense: agencyData.applicantIdProof?.drivingLicense,
              aadharCard: agencyData.applicantIdProof?.aadharCard,
              passport: agencyData.applicantIdProof?.passport,
              panCard: agencyData.applicantIdProof?.panCard,
            },
            previousFactoryLicense: {
              previousFactoryLicense:
                agencyData.previousFactoryLicense?.previousFactoryLicense,
              planApprovalLetter:
                agencyData.previousFactoryLicense?.planApprovalLetter,
            },
            privateLimitedCompany: {
              listOfDirectors:
                agencyData.privateLimitedCompany?.listOfDirectors,
              moa: agencyData.privateLimitedCompany?.moa,
              boardResolution:
                agencyData.privateLimitedCompany?.boardResolution,
              form32: agencyData.privateLimitedCompany?.form32,
            },
            listOfRawMaterials: {
              listOfRawMaterials:
                agencyData.listOfRawMaterials?.listOfRawMaterials,
            },
            ownershipDocuments: {
              leaveAndLicenseAgreement:
                agencyData.ownershipDocuments?.leaveAndLicenseAgreement,
              midcAllotmentLetter:
                agencyData.ownershipDocuments?.midcAllotmentLetter,
              sevenTwelveExtract:
                agencyData.ownershipDocuments?.sevenTwelveExtract,
              taxReceipt: agencyData.ownershipDocuments?.taxReceipt,
            },
            localAuthorityNoC: {
              localAuthorityNoC:
                agencyData.localAuthorityNoC?.localAuthorityNoC,
              corporationNoC: agencyData.localAuthorityNoC?.corporationNoC,
              grampanchayatNoC: agencyData.localAuthorityNoC?.grampanchayatNoC,
              midcNoC: agencyData.localAuthorityNoC?.midcNoC,
            },
            mpcbConsent: {
              mpcbConsent: agencyData.mpcbConsent?.mpcbConsent,
            },
            sketchFactory: {
              sketch: agencyData.sketchFactory?.sketch,
            },
            electricityBill: {
              electricityBill: agencyData.electricityBill?.electricityBill,
              loadSanctionletter:
                agencyData.electricityBill?.loadSanctionletter,
            },
            acceptanceLetter: {
              acceptanceLetter: agencyData.acceptanceLetter?.acceptanceLetter,
            },
            flowChart: {
              flowChart: agencyData.flowChart?.flowChart,
            },
          },
        },
        { new: true }
      )
      console.log('Agency updated successfully')
    } else {
      console.log('Creating new agency...')
      agency = new Agency({
        ...agencyData,
        occupierDocuments: {
          name: agencyData.occupierDocuments?.name,
          photo: agencyData.occupierDocuments?.photo,
          signature: agencyData.occupierDocuments?.signature,
        },
        applicantIdProof: {
          electionId: agencyData.applicantIdProof?.electionId,
          drivingLicense: agencyData.applicantIdProof?.drivingLicense,
          aadharCard: agencyData.applicantIdProof?.aadharCard,
          passport: agencyData.applicantIdProof?.passport,
          panCard: agencyData.applicantIdProof?.panCard,
        },
        previousFactoryLicense: {
          previousFactoryLicense:
            agencyData.previousFactoryLicense?.previousFactoryLicense,
          planApprovalLetter:
            agencyData.previousFactoryLicense?.planApprovalLetter,
        },
        privateLimitedCompany: {
          listOfDirectors: agencyData.privateLimitedCompany?.listOfDirectors,
          moa: agencyData.privateLimitedCompany?.moa,
          boardResolution: agencyData.privateLimitedCompany?.boardResolution,
          form32: agencyData.privateLimitedCompany?.form32,
        },
        listOfRawMaterials: {
          listOfRawMaterials: agencyData.listOfRawMaterials?.listOfRawMaterials,
        },
        ownershipDocuments: {
          leaveAndLicenseAgreement:
            agencyData.ownershipDocuments?.leaveAndLicenseAgreement,
          midcAllotmentLetter:
            agencyData.ownershipDocuments?.midcAllotmentLetter,
          sevenTwelveExtract: agencyData.ownershipDocuments?.sevenTwelveExtract,
          taxReceipt: agencyData.ownershipDocuments?.taxReceipt,
        },
        localAuthorityNoC: {
          localAuthorityNoC: agencyData.localAuthorityNoC?.localAuthorityNoC,
          corporationNoC: agencyData.localAuthorityNoC?.corporationNoC,
          grampanchayatNoC: agencyData.localAuthorityNoC?.grampanchayatNoC,
          midcNoC: agencyData.localAuthorityNoC?.midcNoC,
        },
        mpcbConsent: {
          mpcbConsent: agencyData.mpcbConsent?.mpcbConsent,
        },
        sketchFactory: {
          sketch: agencyData.sketchFactory?.sketch,
        },
        electricityBill: {
          electricityBill: agencyData.electricityBill?.electricityBill,
          loadSanctionletter: agencyData.electricityBill?.loadSanctionletter,
        },
        acceptanceLetter: {
          acceptanceLetter: agencyData.acceptanceLetter?.acceptanceLetter,
        },
        flowChart: {
          flowChart: agencyData.flowChart?.flowChart,
        },
        user: agencyData.user,
      })
      console.log('Saving new agency to database...')
      await agency.save()
      console.log('New agency saved successfully')
    }

    console.log('Final agency object:', agency)
    console.log('=== UPSERT AGENCY COMPLETED ===')
    return JSON.stringify(agency)
  } catch (error) {
    console.error('=== ERROR IN UPSERT AGENCY ===')
    console.error('Error details:', error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    throw error // Re-throw to propagate to caller
  }
}
// get all agencies
export const getAgencies = async () => {
  try {
    await connectDB()
    const agencies = await Agency.find({}).populate('user').lean().exec()
    const plainAgencies = JSON.parse(JSON.stringify(agencies))
    return plainAgencies
  } catch (error) {
    console.error('Error getting agencies:', error)
    throw new Error('Error getting agencies')
  }
}
export const getAgency = async (id: string): Promise<IAgency | null> => {
  try {
    await connectDB()
    const agency = await Agency.findOne({ _id: id })
      .populate('user')
      .lean()
      .exec()
    // const plainAgency = JSON.parse(JSON.stringify(agency))
    return agency as IAgency | null;;
  } catch (error) {
    console.error('Error getting agency:', error)
    throw new Error('Error getting agency')
  }
}
export const deleteAgency = async (id: string) => {
  try {
    await connectDB()
    const agency = await Agency.findById({ id })
    if (!agency) return 'Agency not found'
    agency?.occupierDocuments?.photo &&
      deleteFile({ fileKey: agency?.occupierDocuments?.photo })
    agency?.occupierDocuments?.signature &&
      deleteFile({ fileKey: agency?.occupierDocuments?.signature })
    agency?.applicantIdProof?.electionId &&
      deleteFile({ fileKey: agency?.applicantIdProof?.electionId })
    agency?.applicantIdProof?.drivingLicense &&
      deleteFile({ fileKey: agency?.applicantIdProof?.drivingLicense })
    agency?.applicantIdProof?.aadharCard &&
      deleteFile({ fileKey: agency?.applicantIdProof?.aadharCard })
    agency?.applicantIdProof?.passport &&
      deleteFile({ fileKey: agency?.applicantIdProof?.passport })
    agency?.previousFactoryLicense?.previousFactoryLicense &&
      deleteFile({
        fileKey: agency?.previousFactoryLicense?.previousFactoryLicense,
      })
    agency?.previousFactoryLicense?.planApprovalLetter &&
      deleteFile({
        fileKey: agency?.previousFactoryLicense?.planApprovalLetter,
      })
    agency?.privateLimitedCompany?.moa &&
      deleteFile({ fileKey: agency?.privateLimitedCompany?.moa })
    agency?.privateLimitedCompany?.boardResolution &&
      deleteFile({ fileKey: agency?.privateLimitedCompany?.boardResolution })
    agency?.privateLimitedCompany?.form32 &&
      deleteFile({ fileKey: agency?.privateLimitedCompany?.form32 })
    agency?.listOfRawMaterials?.listOfRawMaterials &&
      deleteFile({ fileKey: agency?.listOfRawMaterials?.listOfRawMaterials })
    agency?.ownershipDocuments?.leaveAndLicenseAgreement &&
      deleteFile({
        fileKey: agency?.ownershipDocuments?.leaveAndLicenseAgreement,
      })
    agency?.ownershipDocuments?.midcAllotmentLetter &&
      deleteFile({ fileKey: agency?.ownershipDocuments?.midcAllotmentLetter })
    agency?.ownershipDocuments?.sevenTwelveExtract &&
      deleteFile({ fileKey: agency?.ownershipDocuments?.sevenTwelveExtract })
    agency?.ownershipDocuments?.taxReceipt &&
      deleteFile({ fileKey: agency?.ownershipDocuments?.taxReceipt })
    agency?.localAuthorityNoC?.localAuthorityNoC &&
      deleteFile({ fileKey: agency?.localAuthorityNoC?.localAuthorityNoC })
    agency?.localAuthorityNoC?.corporationNoC &&
      deleteFile({ fileKey: agency?.localAuthorityNoC?.corporationNoC })
    agency?.localAuthorityNoC?.grampanchayatNoC &&
      deleteFile({ fileKey: agency?.localAuthorityNoC?.grampanchayatNoC })
    agency?.localAuthorityNoC?.midcNoC &&
      deleteFile({ fileKey: agency?.localAuthorityNoC?.midcNoC })
    agency?.mpcbConsent?.mpcbConsent &&
      deleteFile({ fileKey: agency?.mpcbConsent?.mpcbConsent })
    agency?.sketchFactory?.sketch &&
      deleteFile({ fileKey: agency?.sketchFactory?.sketch })
    agency?.electricityBill?.electricityBill &&
      deleteFile({ fileKey: agency?.electricityBill?.electricityBill })
    agency?.electricityBill?.loadSanctionletter &&
      deleteFile({ fileKey: agency?.electricityBill?.loadSanctionletter })
    agency?.acceptanceLetter?.acceptanceLetter &&
      deleteFile({ fileKey: agency?.acceptanceLetter?.acceptanceLetter })
    agency?.flowChart?.flowChart &&
      deleteFile({ fileKey: agency?.flowChart?.flowChart })
    await Agency.findByIdAndDelete({
      _id: id,
    })

    return agency
  } catch (error) {
    console.error('Error deleting agency:', error)
    throw new Error('Error deleting agency')
  }
}
export const updateDocument = async (
  id: string,
  documentPath: string,
  newDocument: string
) => {
  try {
    await connectDB()
    const agency = await Agency.findOne({ id })
    let doc = agency?.[documentPath]
    await deleteFile(doc)
    doc = newDocument
    await Agency.findByIdAndUpdate(
      agency?._id,
      {
        $set: {
          [documentPath]: doc,
        },
      },
      { new: true }
    )
  } catch (error) {
    console.error('Error updating document:', error)
    throw new Error('Error updating document')
  }
}

const deleteFile = async ({ fileKey }: { fileKey: string | string[] }) => {
  try {
    const result = await utapi.deleteFiles(
      fileKey
    )
    console.log(result, 'result')
    return result
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Error deleting file')
  }
}

// to do
export const getFactoryLicense = async (id: string): Promise<IFactoryLicenseDetails | null> => {
  try {
    await connectDB()
    const factoryLicense = await Agency.findOne({ _id: id })
      .populate('user')
      .lean()
      .exec()
    return factoryLicense as IFactoryLicenseDetails | null
  } catch (error) {
    console.error('Error getting factory license:', error)
    throw new Error('Error getting factory license')
  }
}

// Plan Approval CRUD Functions
export const updatePlanApproval = async (
  id: string,
  planApprovalData: {
    applicationForm?: string
    siteLayout?: string
    buildingPlan?: string
    machineryLayout?: string
    structuralDrawings?: string
    ventilationPlan?: string
    safetyMeasures?: string
    landOwnership?: string
    soilTest?: string
    environmentClearance?: string
    nabh1approval?: string
    otherDocuments?: string
  }
) => {
  try {
    await connectDB()
    const agency = await Agency.findByIdAndUpdate(
      id,
      {
        $set: {
          planApproval: {
            applicationForm: planApprovalData.applicationForm,
            siteLayout: planApprovalData.siteLayout,
            buildingPlan: planApprovalData.buildingPlan,
            machineryLayout: planApprovalData.machineryLayout,
            structuralDrawings: planApprovalData.structuralDrawings,
            ventilationPlan: planApprovalData.ventilationPlan,
            safetyMeasures: planApprovalData.safetyMeasures,
            landOwnership: planApprovalData.landOwnership,
            soilTest: planApprovalData.soilTest,
            environmentClearance: planApprovalData.environmentClearance,
            nabh1approval: planApprovalData.nabh1approval,
            otherDocuments: planApprovalData.otherDocuments,
          },
        },
      },
      { new: true }
    )
    return agency
  } catch (error) {
    console.error('Error updating plan approval:', error)
    throw new Error('Error updating plan approval')
  }
}

export const getPlanApproval = async (id: string) => {
  try {
    await connectDB()
    const agency = await Agency.findById(id).lean().exec()
    if (!agency) {
      throw new Error('Agency not found')
    }
    return (agency as IAgency).planApproval || null
  } catch (error) {
    console.error('Error getting plan approval:', error)
    throw new Error('Error getting plan approval')
  }
}

export const deletePlanApproval = async (id: string) => {
  try {
    await connectDB()
    const agency = await Agency.findById(id)
    if (!agency) {
      throw new Error('Agency not found')
    }

    // Delete all plan approval files
    const planApproval = agency.planApproval
    if (planApproval) {
      planApproval.applicationForm &&
        (await deleteFile({ fileKey: planApproval.applicationForm }))
      planApproval.siteLayout &&
        (await deleteFile({ fileKey: planApproval.siteLayout }))
      planApproval.buildingPlan &&
        (await deleteFile({ fileKey: planApproval.buildingPlan }))
      planApproval.machineryLayout &&
        (await deleteFile({ fileKey: planApproval.machineryLayout }))
      planApproval.structuralDrawings &&
        (await deleteFile({ fileKey: planApproval.structuralDrawings }))
      planApproval.ventilationPlan &&
        (await deleteFile({ fileKey: planApproval.ventilationPlan }))
      planApproval.safetyMeasures &&
        (await deleteFile({ fileKey: planApproval.safetyMeasures }))
      planApproval.landOwnership &&
        (await deleteFile({ fileKey: planApproval.landOwnership }))
      planApproval.soilTest &&
        (await deleteFile({ fileKey: planApproval.soilTest }))
      planApproval.environmentClearance &&
        (await deleteFile({ fileKey: planApproval.environmentClearance }))
      planApproval.nabh1approval &&
        (await deleteFile({ fileKey: planApproval.nabh1approval }))
      planApproval.otherDocuments &&
        (await deleteFile({ fileKey: planApproval.otherDocuments }))
    }

    // Clear the planApproval field
    await Agency.findByIdAndUpdate(
      id,
      { $unset: { planApproval: '' } },
      { new: true }
    )

    return { success: true, message: 'Plan approval deleted successfully' }
  } catch (error) {
    console.error('Error deleting plan approval:', error)
    throw new Error('Error deleting plan approval')
  }
}

export const updatePlanApprovalDocument = async (
  id: string,
  documentName: string,
  newDocumentUrl: string
) => {
  try {
    await connectDB()
    const agency = await Agency.findById(id)
    if (!agency) {
      throw new Error('Agency not found')
    }

    // Delete old document if it exists
    const oldDocument = agency.planApproval?.[documentName as keyof typeof agency.planApproval]
    if (oldDocument && typeof oldDocument === 'string') {
      await deleteFile({ fileKey: oldDocument })
    }

    // Update with new document
    await Agency.findByIdAndUpdate(
      id,
      {
        $set: {
          [`planApproval.${documentName}`]: newDocumentUrl,
        },
      },
      { new: true }
    )

    return { success: true, message: 'Document updated successfully' }
  } catch (error) {
    console.error('Error updating plan approval document:', error)
    throw new Error('Error updating plan approval document')
  }
}

export const deletePlanApprovalFile = async (id: string, fileKey: string) => {
  try {
    await deleteFile({ fileKey })
    return { success: true, message: 'File deleted successfully' }
  } catch (error) {
    console.error('Error deleting plan approval file:', error)
    throw new Error('Error deleting plan approval file')
  }
}

export const getAgenciesByUser = async (userId: string) => {
  try {
    await connectDB()
    const agencies = await Agency.find({ user: userId })
      .populate('user')
      .lean()
      .exec()
    return JSON.parse(JSON.stringify(agencies))
  } catch (error) {
    console.error('Error getting agencies:', error)
    throw new Error('Error getting agencies')
  }
}