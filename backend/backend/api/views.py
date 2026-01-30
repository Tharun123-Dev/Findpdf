from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PDF, Roadmap, InterviewQuestion
from .supabase_client import supabase
import uuid


# ================= PDF =================
@api_view(["POST", "GET"])
def pdfs(request):
    if request.method == "POST":
        try:
            title = request.POST.get("title")
            pdf_file = request.FILES.get("file")
            image = request.FILES.get("image")

            if not title or not pdf_file or not image:
                return Response({"error": "All fields required"}, status=400)

            pdf_name = f"{uuid.uuid4()}-{pdf_file.name}"
            img_name = f"{uuid.uuid4()}-{image.name}"

            # Upload PDF
            supabase.storage.from_("pdfs").upload(
                path=pdf_name,
                file=pdf_file.read(),
                file_options={
                    "content-type": pdf_file.content_type,
                    "upsert": False
                }
            )

            # Upload Image
            supabase.storage.from_("images").upload(
                path=img_name,
                file=image.read(),
                file_options={
                    "content-type": image.content_type,
                    "upsert": False
                }
            )

            pdf_url = supabase.storage.from_("pdfs").get_public_url(pdf_name)
            img_url = supabase.storage.from_("images").get_public_url(img_name)

            # ⛔ PENDING BY DEFAULT
            PDF.objects.create(
                title=title,
                file_url=pdf_url,
                image_url=img_url,
                is_approved=False
            )

            return Response({
                "message": "PDF uploaded successfully. Waiting for admin approval."
            })

        except Exception as e:
            print("PDF UPLOAD ERROR:", e)
            return Response({"error": str(e)}, status=500)

    # ✅ ONLY APPROVED PDFs
    data = PDF.objects.filter(is_approved=True).order_by("-created_at").values()
    return Response(data)


@api_view(["POST"])
def pdf_download(request, pk):
    try:
        pdf = PDF.objects.get(id=pk, is_approved=True)
        pdf.download_count += 1
        pdf.save()

        return Response({
            "url": pdf.file_url,
            "download_count": pdf.download_count
        })
    except PDF.DoesNotExist:
        return Response({"error": "PDF not found"}, status=404)
    
@api_view(["POST"])
def increment_pdf_view(request, pk):
    pdf = PDF.objects.get(id=pk, is_approved=True)
    pdf.view_count += 1
    pdf.save()
    return Response({"views": pdf.view_count})




# ================= ROADMAP =================
@api_view(["POST", "GET"])
def roadmaps(request):
    if request.method == "POST":
        try:
            title = request.POST.get("title")
            desc = request.POST.get("description")
            image = request.FILES.get("image")

            if not title or not desc or not image:
                return Response({"error": "All fields required"}, status=400)

            img_name = f"{uuid.uuid4()}-{image.name}"
            supabase.storage.from_("images").upload(
                img_name,
                image.read(),
                file_options={
                    "content-type": image.content_type,
                    "upsert": False
                }
            )

            img_url = supabase.storage.from_("images").get_public_url(img_name)

            # ⛔ PENDING BY DEFAULT
            Roadmap.objects.create(
                title=title,
                description=desc,
                image_url=img_url,
                is_approved=False
            )

            return Response({
                "message": "Roadmap uploaded. Waiting for admin approval."
            })

        except Exception as e:
            print("ROADMAP UPLOAD ERROR:", e)
            return Response({"error": str(e)}, status=500)

    # ✅ ONLY APPROVED ROADMAPS
    data = Roadmap.objects.filter(is_approved=True).order_by("-created_at").values()
    return Response(data)


@api_view(["POST"])
def roadmap_download(request, pk):
    try:
        roadmap = Roadmap.objects.get(id=pk, is_approved=True)
        roadmap.download_count += 1
        roadmap.save()

        return Response({
            "url": roadmap.image_url,
            "download_count": roadmap.download_count
        })
    except Roadmap.DoesNotExist:
        return Response({"error": "Roadmap not found"}, status=404)
    

@api_view(["POST"])
def increment_roadmap_view(request, pk):
    roadmap = Roadmap.objects.get(id=pk, is_approved=True)
    roadmap.view_count += 1
    roadmap.save()
    return Response({"views": roadmap.view_count})



# ================= INTERVIEW QUESTIONS =================
@api_view(["POST", "GET"])
def interview_questions(request):
    if request.method == "POST":
        try:
            company = request.POST.get("company")
            role = request.POST.get("role")
            pdf = request.FILES.get("file")

            if not company or not role or not pdf:
                return Response({"error": "All fields required"}, status=400)

            pdf_name = f"{uuid.uuid4()}-{pdf.name}"

            supabase.storage.from_("interview_pdfs").upload(
                path=pdf_name,
                file=pdf.read(),
                file_options={
                    "content-type": pdf.content_type,
                    "upsert": False
                }
            )

            pdf_url = supabase.storage.from_("interview_pdfs").get_public_url(pdf_name)

            # ⛔ PENDING BY DEFAULT
            InterviewQuestion.objects.create(
                company=company,
                role=role,
                pdf_url=pdf_url,
                is_approved=False
            )

            return Response({
                "message": "Interview PDF uploaded. Waiting for admin approval."
            })

        except Exception as e:
            print("INTERVIEW UPLOAD ERROR:", e)
            return Response({"error": str(e)}, status=500)

    # ✅ ONLY APPROVED INTERVIEW QUESTIONS
    data = InterviewQuestion.objects.filter(
        is_approved=True
    ).order_by("company", "role").values()

    return Response(data)


@api_view(["POST"])
def interview_download(request, pk):
    try:
        interview = InterviewQuestion.objects.get(id=pk, is_approved=True)
        interview.download_count += 1
        interview.save()

        return Response({
            "url": interview.pdf_url,
            "download_count": interview.download_count
        })
    except InterviewQuestion.DoesNotExist:
        return Response({"error": "Interview PDF not found"}, status=404)


@api_view(["POST"])
def increment_interview_view(request, pk):
    interview = InterviewQuestion.objects.get(id=pk, is_approved=True)
    interview.view_count += 1
    interview.save()
    return Response({"views": interview.view_count})
