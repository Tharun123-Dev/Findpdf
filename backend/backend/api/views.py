from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PDF,Roadmap,InterviewQuestion
from .supabase_client import supabase
import uuid

@api_view(["POST", "GET"])
def pdfs(request):
    if request.method == "POST":
        try:
            title = request.POST.get("title")
            pdf_file = request.FILES.get("file")
            image = request.FILES.get("image")

            if not pdf_file or not image:
                return Response({"error": "Files missing"}, status=400)

            pdf_name = f"{uuid.uuid4()}-{pdf_file.name}"
            img_name = f"{uuid.uuid4()}-{image.name}"

            # ✅ Upload PDF
            supabase.storage.from_("pdfs").upload(
                path=pdf_name,
                file=pdf_file.read(),
                file_options={
                    "content-type": pdf_file.content_type,
                    "upsert": False
                }
            )

            # ✅ Upload Image
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

            PDF.objects.create(
                title=title,
                file_url=pdf_url,
                image_url=img_url
            )

            return Response({"message": "PDF uploaded successfully"})

        except Exception as e:
            print("UPLOAD ERROR:", e)
            return Response({"error": str(e)}, status=500)

    data = PDF.objects.all().values()
    return Response(data)


# roadmap
@api_view(["POST", "GET"])
def roadmaps(request):
    if request.method == "POST":
        title = request.POST["title"]
        desc = request.POST["description"]
        image = request.FILES["image"]

        img_name = f"{uuid.uuid4()}-{image.name}"
        supabase.storage.from_("images").upload(img_name, image.read())
        img_url = supabase.storage.from_("images").get_public_url(img_name)

        Roadmap.objects.create(
            title=title,
            description=desc,
            image_url=img_url
        )

        return Response({"message": "Roadmap uploaded"})

    data = Roadmap.objects.all().values()
    return Response(data)

# interview questions
@api_view(["POST", "GET"])
def interview_questions(request):

    if request.method == "POST":
        try:
            company = request.POST.get("company")
            role = request.POST.get("role")
            pdf = request.FILES.get("file")  # ✅ FIXED

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

            InterviewQuestion.objects.create(
                company=company,
                role=role,
                pdf_url=pdf_url
            )

            return Response({"message": "Interview PDF uploaded successfully"})

        except Exception as e:
            print("INTERVIEW UPLOAD ERROR:", e)
            return Response({"error": str(e)}, status=500)

    data = InterviewQuestion.objects.all().order_by("company", "role").values()
    return Response(data)
