PGDMP     !                    x         	   init_data    11.5    11.5                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false                       1262    38000 	   init_data    DATABASE     �   CREATE DATABASE init_data WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Chinese (Simplified)_People''s Republic of China.936' LC_CTYPE = 'Chinese (Simplified)_People''s Republic of China.936';
    DROP DATABASE init_data;
             postgres    false            �            1255    38001    add_column(text, text, text)    FUNCTION     �  CREATE FUNCTION public.add_column(tablename text, columnname text, columntype text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    viewExist integer;
    resu json;
    BEGIN
    
        select 
            count(1) into viewExist 
        from 
            information_schema.columns 
        where 
            table_schema='public' 
                AND 
            table_name=tablename 
                AND
            column_name = columnname;
            
        IF viewExist = 0 THEN
           EXECUTE('ALTER TABLE "' || tablename || '" ADD COLUMN "' || columnname || '" ' || columntype);
           resu :='{"code":"success"}';
        else 
           resu :='{"code":"fail"}';
        END IF;
        RETURN resu;
    END;   
    $$;
 S   DROP FUNCTION public.add_column(tablename text, columnname text, columntype text);
       public       postgres    false            �            1255    38002    add_them(integer, integer)    FUNCTION     �   CREATE FUNCTION public.add_them(a integer, b integer) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$
 SELECT $1 + $2;
$_$;
 5   DROP FUNCTION public.add_them(a integer, b integer);
       public       postgres    false            �            1255    38003    change_column(text, text, text)    FUNCTION       CREATE FUNCTION public.change_column(tablename text, columnname text, columnnewname text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    viewExist integer;
    resu json;
    BEGIN
    
        select 
            count(1) into viewExist 
        from 
            information_schema.columns 
        where 
            table_schema='public' 
                AND 
            table_name=tablename 
                AND
            column_name = columnname;
            
        IF viewExist = 0 THEN
           resu :='{"code":"fail"}';
        else 
            EXECUTE('ALTER TABLE "' || tablename || '" RENAME "' || columnname || '" TO "' || columnnewname || '"' );
            resu :='{"code":"success"}';
        END IF;
        RETURN resu;
    END;   
    $$;
 Y   DROP FUNCTION public.change_column(tablename text, columnname text, columnnewname text);
       public       postgres    false            �            1255    38004    create_table(text[])    FUNCTION     r  CREATE FUNCTION public.create_table(subtotal text[]) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
   m	text;
   r	json;
   BEGIN
	r := '{"code":"ok"}';
	  foreach m in array subtotal
	  loop
	    EXECUTE(replace(m,'#','"'));
	  end loop;
	--EXCEPTION
	--WHEN others THEN    
	--	RAISE EXCEPTION '(%)', SQLERRM; 		
   RETURN r;   
   END;   
   $$;
 4   DROP FUNCTION public.create_table(subtotal text[]);
       public       postgres    false            �            1255    38005    del_ora_table()    FUNCTION     �  CREATE FUNCTION public.del_ora_table() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    tmp VARCHAR(512);
DECLARE names CURSOR FOR 
    select tablename from pg_tables where schemaname='public';
BEGIN
  FOR stmt IN names LOOP
    tmp := 'DROP TABLE '|| quote_ident(stmt.tablename) || ' CASCADE;';
    RAISE NOTICE 'notice: %', tmp;
    EXECUTE 'DROP TABLE '|| quote_ident(stmt.tablename) || ' CASCADE;';
  END LOOP;
  RAISE NOTICE 'finished .....';
END;
 
$$;
 &   DROP FUNCTION public.del_ora_table();
       public       postgres    false            �            1255    38006    delete_column(text, text)    FUNCTION     �  CREATE FUNCTION public.delete_column(tablename text, columnname text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    viewExist integer;
    resu json;
    BEGIN
    
        select 
            count(1) into viewExist 
        from 
            information_schema.columns 
        where 
            table_schema='public' 
                AND 
            table_name=tablename 
                AND
            column_name = columnname;
            
        IF viewExist = 0 THEN
           resu :='{"code":"fail"}';
        else 
            EXECUTE('ALTER TABLE "' || tablename || '" DROP COLUMN "' || columnname || '"');
            resu :='{"code":"success"}';
        END IF;
        RETURN resu;
    END;   
    $$;
 E   DROP FUNCTION public.delete_column(tablename text, columnname text);
       public       postgres    false            �            1255    38007 %   delete_role_power_project(text, text)    FUNCTION     #  CREATE FUNCTION public.delete_role_power_project(tablename text, projectid text) RETURNS character varying
    LANGUAGE plpgsql
    AS $$ 
        DECLARE
            v_rec record;
            v_index bigint;
        BEGIN
            for v_rec in EXECUTE 'select * from "' || tableName || '"' loop
       
                PERFORM update_jsonb_item(
                        tableName, 
                        'content', 
                        '''project''',  
                        '(
                            select 
                                jsonb_build_array-> 0 
                            from 
                                jsonb_build_array(ARRAY(
                                    select 
                                        value from "' || tableName || '" t3,
                                        jsonb_array_elements(content-> ''project'')  
                                    where 
                                        t1.id = t3.id 
                                        AND 
                                        value -> ''id'' <> ''"' || projectid || '"''
                            )))',
                       'WHERE id = ''' ||  v_rec.id || ''''
                );
               
            end loop; 

            RETURN 'SUCCESS';
        END;
        $$;
 P   DROP FUNCTION public.delete_role_power_project(tablename text, projectid text);
       public       postgres    false            �            1255    38008 *   delete_role_power_window(text, text, text)    FUNCTION       CREATE FUNCTION public.delete_role_power_window(tablename text, projectid text, windowid text) RETURNS character varying
    LANGUAGE plpgsql
    AS $$ 
		DECLARE
			v_rec record;
			v_index bigint;
		BEGIN
			for v_rec in EXECUTE 'select * from "' || tableName || '"' loop
				EXECUTE('select COALESCE((SELECT ORDINALITY::INT - 1 FROM "'|| tableName ||'" t2 , jsonb_array_elements(content-> ''project'') WITH ORDINALITY WHERE t2.id=''' || v_rec.id || ''' AND value ->''id'' = ''"'|| projectid ||'"''),-1) ') into v_index;

				IF v_index > -1
				THEN
				   PERFORM update_jsonb_item(
						tableName, 
						'content', 
						'''project'',''' || v_index || ''',''windowList''',  
						'(
					   		select jsonb_build_array -> 0 
					   			from 
    						jsonb_build_array(ARRAY(
								select value from jsonb_array_elements((
									select 
										value->''windowList'' 
									from 
										"' || tableName || '" t3,
										jsonb_array_elements(content-> ''project'')
									where 
										t3.id = t1.id 
					   				AND
					   					value ->''id''  = ''"' || projectid || '"''
								)) where value <> ''"' || windowid || '"''
							)))',
					   'WHERE id = ''' ||  v_rec.id || ''''
					);
				END IF;
			end loop; 

			RETURN 'SUCCESS';
		END;
		$$;
 ^   DROP FUNCTION public.delete_role_power_window(tablename text, projectid text, windowid text);
       public       postgres    false            �            1255    38009    delete_table(text[])    FUNCTION     }  CREATE FUNCTION public.delete_table(subtotal text[]) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
   m	text;
   r	json;
   BEGIN
	r := '{"code":"ok"}';
	  foreach m in array subtotal
	  loop
	    EXECUTE 'DROP TABLE '|| quote_ident(m);
	  end loop;
	--EXCEPTION
	--WHEN others THEN    
	--	RAISE EXCEPTION '(%)', SQLERRM; 		
   RETURN r;   
   END;   
   $$;
 4   DROP FUNCTION public.delete_table(subtotal text[]);
       public       postgres    false            �            1255    38010    excute_sql(text)    FUNCTION     s  CREATE FUNCTION public.excute_sql(sqltext text) RETURNS json
    LANGUAGE plpgsql
    AS $$
	DECLARE
	   resultData json;
	   BEGIN
	    --支持无限嵌套
	    EXECUTE('select array_to_json(array_agg(row_to_json(tempTableName1))) from (select * from ('|| sqltext ||') as tempTableName2) as tempTableName1') into resultData;
	    return resultData;
	   END;   
	   $$;
 /   DROP FUNCTION public.excute_sql(sqltext text);
       public       postgres    false            �            1255    38011    raise_demo()    FUNCTION     �   CREATE FUNCTION public.raise_demo() RETURNS text
    LANGUAGE plpgsql
    AS $$
declare 
param1 text:= 'one';
param2 text:= 'two';
begin 
raise notice 'this is raise demo , param1 is % ,param2 is %',param1,param2;
return param1;
end;
$$;
 #   DROP FUNCTION public.raise_demo();
       public       postgres    false            �            1255    38012 +   readmodelinstance(uuid, uuid, text[], json)    FUNCTION     /  CREATE FUNCTION public.readmodelinstance(modelid uuid, modelinstance uuid, filedcoll text[], statue json) RETURNS TABLE(sss json)
    LANGUAGE plpgsql
    AS $$
DECLARE
    sql   text;
    i integer;
    j json;
    k json;
    attrcnt integer;
    stacnt  integer;
    condition text;
BEGIN
  --遍历是否返回指定字段
  select array_length(filedcoll,1)into attrcnt;
  i:=1;
  sql := '';
  FOR i IN 1..attrcnt LOOP
      sql := sql ||'content->>''' || filedcoll[i] || ''' as "' || filedcoll[i] || '"';--循环拼接
      if(i <> attrcnt)then 
    sql := sql || ',';--差个逗号
      end if;
  END LOOP;
  --根据传的‘’判断字符长度0，代替空数组
  if(char_length(filedcoll[i]) = 0)then
      sql := 'content';
  end if;  
  sql := 'select ' || sql || ' from public."'|| modelinstance ||'" where organization=false and "modelId" = ''' || modelid || ''' and( ';
  --遍历过滤条件
  RAISE NOTICE 'statue is %',statue;
  --select  json_array_length(statue) into stacnt;
  
  
  --返回结果
  return query  EXECUTE sql ;
   END;   
   $$;
 i   DROP FUNCTION public.readmodelinstance(modelid uuid, modelinstance uuid, filedcoll text[], statue json);
       public       postgres    false            �            1255    38013    sales_tax(real)    FUNCTION     �   CREATE FUNCTION public.sales_tax(subtotal real) RETURNS real
    LANGUAGE plpgsql
    AS $$
   BEGIN
      RETURN subtotal * 0.06;
   END;
   $$;
 /   DROP FUNCTION public.sales_tax(subtotal real);
       public       postgres    false            �            1255    38014 /   update_jsonb_item(text, text, text, text, text)    FUNCTION     �  CREATE FUNCTION public.update_jsonb_item(tablename text, columnname text, path text, updatedata text, contains text) RETURNS character varying
    LANGUAGE plpgsql
    AS $$ 
		DECLARE
		
		BEGIN
			EXECUTE('UPDATE "'|| tableName || '" t1 SET ' || columnname || ' = jsonb_set(' || columnname || 
				',array[' || path || '],' || updatedata || ') ' || contains);
			RETURN 'SUCCESS';
		END;
		$$;
 t   DROP FUNCTION public.update_jsonb_item(tablename text, columnname text, path text, updatedata text, contains text);
       public       postgres    false            �            1259    38015    companys    TABLE     �  CREATE TABLE public.companys (
    id uuid NOT NULL,
    status boolean,
    "companyName" character varying(128),
    "legPerson" character varying(128),
    email character varying(100),
    "projectName" character varying(128),
    "powerName" character varying(128),
    "roleName" character varying(128),
    "deptName" character varying(128),
    "userRoleName" character varying(128),
    "userDeptName" character varying(128),
    "rolePowerName" character varying(128),
    "windowName" character varying(128),
    "spriteName" character varying(128),
    "driverName" character varying(128),
    "modelDefineName" character varying(128),
    "modelAttrName" character varying(128),
    "modelInstanceName" character varying(128),
    "imageName" character varying(128),
    extend jsonb,
    "strategyName" character varying(128),
    "companyDesc" character varying(200),
    "companyPhone" character varying(128),
    "companyEmail" character varying(128)
);
    DROP TABLE public.companys;
       public         postgres    false            �            1259    38021    users    TABLE     )  CREATE TABLE public.users (
    id uuid NOT NULL,
    "userName" character varying(40),
    "userPassword" character varying(200),
    phone character varying(40),
    email character varying(100),
    "companyName" character varying(80),
    "companyId" uuid,
    note text,
    admin boolean
);
    DROP TABLE public.users;
       public         postgres    false                      0    38015    companys 
   TABLE DATA               m  COPY public.companys (id, status, "companyName", "legPerson", email, "projectName", "powerName", "roleName", "deptName", "userRoleName", "userDeptName", "rolePowerName", "windowName", "spriteName", "driverName", "modelDefineName", "modelAttrName", "modelInstanceName", "imageName", extend, "strategyName", "companyDesc", "companyPhone", "companyEmail") FROM stdin;
    public       postgres    false    196   =                 0    38021    users 
   TABLE DATA               v   COPY public.users (id, "userName", "userPassword", phone, email, "companyName", "companyId", note, admin) FROM stdin;
    public       postgres    false    197   9=       �
           2606    38028    companys companys_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.companys
    ADD CONSTRAINT companys_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.companys DROP CONSTRAINT companys_pkey;
       public         postgres    false    196            �
           2606    38030    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         postgres    false    197            �
           2606    38031    users users_companyId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companys(id);
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_companyId_fkey";
       public       postgres    false    197    196    2704                  x������ � �         S   x�]�1�  ���ii����ؚ8��GG/��B�P���Т1����&��zpw���aD�Y�*U*��4��<�����     