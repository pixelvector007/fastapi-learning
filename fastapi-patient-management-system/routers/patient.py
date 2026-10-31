from fastapi import APIRouter, Path , HTTPException , Query , Depends
from fastapi.responses import JSONResponse
from models.patient import Patient, PatientUpdate
from utils.database import save_data
from dependencies.patient import get_patient_data

router = APIRouter()

@router.get('/view')
def view(data = Depends(get_patient_data)):

    return data

@router.get('/sort')
def sort_patients(sort_by : str = Query(...,description='Sort on the baisis of height , weight , bmi'), 
                  order : str = Query('asc',description='sort in asc or desc order'),
                  data = Depends(get_patient_data)) : 

    valid_fields = ['height','weight','bmi']

    if sort_by not in valid_fields : 

        raise HTTPException(status_code=400, detail = f'Invalid Field.Please select form {valid_fields}')

    order_values = ['asc','desc']

    if order not in order_values : 

        raise HTTPException(status_code=400 , detail = f'Invalid Order. Please select between {order_values}')


    sort_order = True if order=='desc' else False 

    sorted_data = sorted(data.values(),key=lambda x : x.get(sort_by,0),reverse = sort_order)

    return sorted_data



@router.get('/patient/{patient_id}',response_model=Patient)
def view_patient(patient_id : str = Path(...,description='ID of the patient in the DB', example = 'P001'),data = Depends(get_patient_data)) :

    if patient_id in data : 

        return {"id":patient_id,
                **data[patient_id]}

    raise HTTPException(status_code=404, detail='Patient Not Found')


@router.post('/create')
def create_patient(patient : Patient,data = Depends(get_patient_data)) : 


    if patient.id in data : 

        raise HTTPException(status_code=400,detail='Patient already Exists')

    data[patient.id]= patient.model_dump(exclude={'id'})

    save_data(data)

    return JSONResponse(status_code=201,content={'message':'patient created succesfully'})


@router.put('/edit/{patient_id}')
def update_patient(patient_id : str , patient_update : PatientUpdate,data = Depends(get_patient_data)) : 


    if patient_id not in data : 

        raise HTTPException(status_code=404,detail = 'Patient not Found')

    existing_patient_info = data[patient_id]

    updated_patient_info = patient_update.model_dump(exclude_unset=True,exclude_none=True)

    for key,value in updated_patient_info.items() : 

        existing_patient_info[key] = value 

    existing_patient_info['id'] = patient_id

    patient_pydantic_object = Patient(**existing_patient_info)

    updated_patient_data = patient_pydantic_object.model_dump(exclude={'id'})

    data[patient_id] = updated_patient_data

    save_data(data)

    return JSONResponse(status_code=200,content = {'message':'patient updated'})


@router.delete('/delete/{patient_id}')
def delete_patient(patient_id : str,data = Depends(get_patient_data)) : 


    if patient_id not in data :

        raise HTTPException(status_code = 404 , detail = 'Patient Not Found')

    del data[patient_id]

    save_data(data)

    return JSONResponse(status_code = 200 , content = {'message':'Patient Deleted'})

