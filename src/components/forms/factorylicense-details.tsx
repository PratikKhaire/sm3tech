'use client'
import React, { useEffect, useState } from 'react'
import { factoryLicenseDetailsSchema } from '@/types'
import { IFactoryLicenseDetails } from '@/models/factoryLicenseDetails.model'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Building2,
  Waves,
  FileText,
  Factory,
  Home,
  Leaf,
  FileCheck,
  DollarSign,
  BarChart2,
  ClipboardCheck,
  FileSearch,
  Building,
  User,
  Users,
  TreePine,
  FileWarning,
  AlertCircle,
  AlertTriangle,
  PauseCircle,
  XCircle,
  Files,
  Loader2
} from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import FileUpload from '../file-upload'
import { getUser, getAgenciesByUser, updateFactoryLicense } from '@/lib/queries'

type Props = {
  data?: Partial<IFactoryLicenseDetails>
}

const getIconForDocument = (name: string) => {
  const icons = {
    manufacturingProcess: Factory,
    industryRegistration: Building,
    landOwnershipCertificate: Home,
    detailedProposalOfPollutionControlSystem: Leaf,
    previousConsentCopy: FileCheck,
    fixedAssets: DollarSign,
    auditedBalanceSheet: BarChart2,
    visitReport: ClipboardCheck,
    jvsReport: FileSearch,
    localBodyNoc: Building2,
    companysAuthorizationLetter: FileText,
    panCardCopyOfIndustry: FileText,
    aadhaarCardOrPanCardCopyOfAuthorizedPerson: User,
    industryBoardOfResolutionListofDirectors: Users,
    noIncreaseInPollutionLoadCertificate: TreePine,
    environmentClearanceCopyOfExistingProduct: Leaf,
    WarningNotice: AlertCircle,
    ShowCauseNotice: AlertTriangle,
    ProposedDirections: FileWarning,
    InterimDirections: PauseCircle,
    ClosureDirections: XCircle,
    other: Files
  }
  return icons[name as keyof typeof icons] || FileText
}

const FactoryLicenseDetails = ({ data }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [agencyId, setAgencyId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof factoryLicenseDetailsSchema>>({
    resolver: zodResolver(factoryLicenseDetailsSchema),
  })

  // Fetch user's agency on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser()
        if (!user?._id) {
          toast({ title: 'Error', description: 'Please login first', variant: 'destructive' })
          router.push('/agency/sign-in')
          return
        }

        const agencies = await getAgenciesByUser(user._id)
        if (agencies && agencies.length > 0) {
          setAgencyId(agencies[0]._id)
          // Load existing data if available
          if (agencies[0].factoryLicense) {
            Object.entries(agencies[0].factoryLicense).forEach(([key, value]) => {
              if (value) {
                form.setValue(key as any, value as string)
              }
            })
          }
        } else {
          toast({
            title: 'No Agency Found',
            description: 'Please create an agency first in Agency Information',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (values: z.infer<typeof factoryLicenseDetailsSchema>) => {
    if (!agencyId) {
      toast({
        title: 'Error',
        description: 'No agency found. Please create an agency first.',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      await updateFactoryLicense(agencyId, values)
      toast({ title: 'Success', description: 'Factory License documents saved successfully!' })
    } catch (error) {
      console.error('Error saving:', error)
      toast({ title: 'Error', description: 'Failed to save documents', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const renderFileUploadField = (
    name: keyof z.infer<typeof factoryLicenseDetailsSchema>,
    label: string,
    required: boolean = true
  ) => {
    const Icon = getIconForDocument(name)
    return (
      <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100 shadow-sm h-full hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-sora font-semibold text-gray-900 text-sm">
                    {label} {!required && <span className="text-gray-500 text-xs">(Optional)</span>}
                  </h3>
                </div>
                <div className=" rounded-lg p-3 transition-colors hover:border-blue-400">
                  <FileUpload
                    apiEndpoint="pdfUploader"
                    onChange={field.onChange}
                    value={field.value || ''}
                  />
                </div>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </div>
            </FormItem>
          )}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8 font-sora">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -left-4 top-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <Card className="w-full bg-white/80 backdrop-blur-lg shadow-xl border border-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full" />

        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold font-sora text-gray-900">
                Factory License Details
              </CardTitle>
              <p className="text-gray-600 text-sm mt-1">Complete your documentation process</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                {/* Required Documents Section */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <Files className="h-5 w-5 text-blue-600" />
                    <FormLabel className="text-gray-900 font-sora font-semibold text-lg">
                      Required Documents
                    </FormLabel>
                  </div>
                  <div className="flex flex-wrap -mx-2">
                    {renderFileUploadField("manufacturingProcess", "Manufacturing Process")}
                    {renderFileUploadField("industryRegistration", "Industry Registration")}
                    {renderFileUploadField("landOwnershipCertificate", "Land Ownership")}
                    {renderFileUploadField("detailedProposalOfPollutionControlSystem", "Pollution Control")}
                    {renderFileUploadField("previousConsentCopy", "Previous Consent")}
                    {renderFileUploadField("fixedAssets", "Fixed Assets")}
                    {renderFileUploadField("auditedBalanceSheet", "Balance Sheet")}
                  </div>
                </div>

                {/* Additional Documents Section */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <FormLabel className="text-gray-900 font-sora font-semibold text-lg">
                      Additional Documents
                    </FormLabel>
                  </div>
                  <div className="flex flex-wrap -mx-2">
                    {renderFileUploadField("visitReport", "Visit Report", false)}
                    {renderFileUploadField("jvsReport", "JVS Report", false)}
                    {renderFileUploadField("localBodyNoc", "Local Body NOC", false)}
                    {renderFileUploadField("companysAuthorizationLetter", "Authorization", false)}
                    {renderFileUploadField("panCardCopyOfIndustry", "Industry PAN", false)}
                    {renderFileUploadField("aadhaarCardOrPanCardCopyOfAuthorizedPerson", "Auth. Person ID", false)}
                    {renderFileUploadField("industryBoardOfResolutionListofDirectors", "Board Resolution", false)}
                    {renderFileUploadField("noIncreaseInPollutionLoadCertificate", "No Pollution Cert.", false)}
                    {renderFileUploadField("environmentClearanceCopyOfExistingProduct", "Environment Clear.", false)}
                  </div>
                </div>

                {/* Notices and Directions Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <FormLabel className="text-gray-900 font-sora font-semibold text-lg">
                      Notices and Directions
                    </FormLabel>
                  </div>
                  <div className="flex flex-wrap -mx-2">
                    {renderFileUploadField("WarningNotice", "Warning Notice", false)}
                    {renderFileUploadField("ShowCauseNotice", "Show Cause Notice", false)}
                    {renderFileUploadField("ProposedDirections", "Proposed Directions", false)}
                    {renderFileUploadField("InterimDirections", "Interim Directions", false)}
                    {renderFileUploadField("ClosureDirections", "Closure Directions", false)}
                    {renderFileUploadField("other", "Other Documents", false)}
                  </div>
                </div>
              </div>

              <div className='pt-8 flex justify-end'>
                <Button
                  type="submit"
                  disabled={saving || !agencyId}
                  className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Factory License Documents'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FactoryLicenseDetails