from rest_framework.response import Response


def success_response(
    message="Success",
    data=None,
    pagination=None,
    status_code=200,
):
    response = {
        "success": True,
        "message": message,
        "data": data,
    }

    if pagination:
        response["pagination"] = pagination

    return Response(
        response,
        status=status_code,
    )


def error_response(
    message="Failed",
    errors=None,
    status_code=400,
):
    return Response(
        {
            "success": False,
            "message": message,
            "errors": errors or {},
        },
        status=status_code,
    )